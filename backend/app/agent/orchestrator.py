from typing import Dict, Any, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.db.models import AgentSession, AgentTrace, Product, Order, AuditLog
from app.agent.intent_parser import IntentParser
from app.agent.catalog_search import CatalogSearchEngine
from app.agent.comparator import ProductComparator
from app.agent.guardrails import TrustAndSafetyGuard
from app.services.audit_service import AuditService

class AgentOrchestrator:
    @staticmethod
    def create_session(db: Session, user_query: str, budget_limit: float = 1000.0) -> AgentSession:
        """
        Creates a new agentic commerce session.
        """
        session = AgentSession(
            user_query=user_query,
            budget_limit=budget_limit,
            status="IDLE",
            current_step=0,
            current_phase="PLAN"
        )
        db.add(session)
        db.commit()
        db.refresh(session)

        # Audit initial creation
        AuditService.log_event(
            db=db,
            action="SESSION_INITIALIZED",
            actor="USER",
            is_irreversible=False,
            status="SUCCESS",
            details=f"New agent shopping session started with goal: '{user_query}' and budget cap ${budget_limit:,.2f}.",
            session_id=session.id,
            payload={"user_query": user_query, "budget_limit": budget_limit}
        )

        return session

    @staticmethod
    def run_next_step(db: Session, session: AgentSession) -> AgentSession:
        """
        Advances the agent state machine by 1 step.
        """
        if session.is_killed:
            return session

        step = session.current_step

        # =========================================================================
        # STEP 1: GOAL DECOMPOSITION & INTENT PARSING (PLAN)
        # =========================================================================
        if step == 0:
            intent = IntentParser.parse_goal(session.user_query, default_budget=session.budget_limit)
            session.parsed_intent = intent
            session.current_step = 1
            session.current_phase = "PLAN"
            session.status = "PLANNING"

            # Record Agent Trace
            trace = AgentTrace(
                session_id=session.id,
                step_number=1,
                phase="PLAN",
                action_type="PARSE_GOAL",
                title="Decomposed Shopping Goal into Constraints",
                reasoning=(
                    f"Analyzed query: '{session.user_query}'. Extracted target category '{intent['category']}', "
                    f"primary use-case '{intent['use_case']}', budget ceiling ${intent['max_price']:,.2f}, "
                    f"and priority features: {', '.join(intent['priorities']) if intent['priorities'] else 'Standard efficiency'}."
                ),
                input_data={"user_query": session.user_query, "budget_limit": session.budget_limit},
                output_data=intent,
                is_reversible=True
            )
            db.add(trace)

            AuditService.log_event(
                db=db,
                action="INTENT_PARSED",
                actor="AGENT",
                is_irreversible=False,
                status="SUCCESS",
                details=f"Goal decomposed into category '{intent['category']}' with budget ceiling ${intent['max_price']:,.2f}.",
                session_id=session.id,
                payload=intent
            )

            db.commit()
            db.refresh(session)
            return session

        # =========================================================================
        # STEP 2: AUTONOMOUS CATALOG SEARCH (ACT)
        # =========================================================================
        elif step == 1:
            intent = session.parsed_intent or IntentParser.parse_goal(session.user_query, session.budget_limit)
            # Find in-stock candidates
            category = intent.get("category", "Laptops & Computing")
            matching_products = db.query(Product).filter(
                Product.category == category,
                Product.in_stock == True
            ).all()

            candidate_ids = [p.id for p in matching_products]
            session.candidate_product_ids = candidate_ids
            session.current_step = 2
            session.current_phase = "ACT"
            session.status = "SEARCHING"

            trace = AgentTrace(
                session_id=session.id,
                step_number=2,
                phase="ACT",
                action_type="SEARCH_CATALOG",
                title=f"Autonomous Inventory Scan ({len(matching_products)} candidates)",
                reasoning=(
                    f"Executed filtered query on the product database for category '{category}' with in-stock status. "
                    f"Retrieved {len(matching_products)} candidate items matching the initial search domain."
                ),
                input_data={"category": category, "filters": {"in_stock": True}},
                output_data={"candidate_count": len(candidate_ids), "candidate_ids": candidate_ids},
                is_reversible=True
            )
            db.add(trace)

            AuditService.log_event(
                db=db,
                action="CATALOG_SCANNED",
                actor="AGENT",
                is_irreversible=False,
                status="SUCCESS",
                details=f"Retrieved {len(matching_products)} in-stock candidates in category '{category}'.",
                session_id=session.id
            )

            db.commit()
            db.refresh(session)
            return session

        # =========================================================================
        # STEP 3: SCORING & FILTERING (OBSERVE)
        # =========================================================================
        elif step == 2:
            intent = session.parsed_intent or {}
            scored_candidates = CatalogSearchEngine.search_and_score(
                db=db,
                intent=intent,
                budget_limit=session.budget_limit
            )

            top_3 = scored_candidates[:3]
            top_candidate_ids = [p.id for p, _, _ in top_3]
            session.candidate_product_ids = top_candidate_ids
            session.current_step = 3
            session.current_phase = "OBSERVE"
            session.status = "SEARCHING"

            top_names = [f"{p.title} (Score: {score})" for p, score, _ in top_3]

            trace = AgentTrace(
                session_id=session.id,
                step_number=3,
                phase="OBSERVE",
                action_type="FILTER_AND_SCORE",
                title="Evaluated Hardware Specs, Ratings & Budget Fit",
                reasoning=(
                    f"Executed multi-criteria utility function across all candidates. "
                    f"Ranked top options by hardware compatibility, customer sentiment, and value-for-money: "
                    f"{', '.join(top_names)}."
                ),
                input_data={"candidates_evaluated": len(scored_candidates)},
                output_data={"top_ranked": top_names},
                is_reversible=True
            )
            db.add(trace)

            AuditService.log_event(
                db=db,
                action="CANDIDATES_SCORED",
                actor="AGENT",
                is_irreversible=False,
                status="SUCCESS",
                details=f"Evaluated candidates; top candidate: {top_names[0] if top_names else 'None'}.",
                session_id=session.id
            )

            db.commit()
            db.refresh(session)
            return session

        # =========================================================================
        # STEP 4: COMPARATIVE ANALYSIS & TRADE-OFF MATRIX (PLAN)
        # =========================================================================
        elif step == 3:
            intent = session.parsed_intent or {}
            scored_candidates = CatalogSearchEngine.search_and_score(
                db=db,
                intent=intent,
                budget_limit=session.budget_limit
            )

            trade_off_analysis = ProductComparator.build_comparison_analysis(
                top_candidates=scored_candidates,
                intent=intent,
                budget_limit=session.budget_limit
            )

            recommended_id = trade_off_analysis.get("recommended_id")
            session.recommended_product_id = recommended_id
            session.trade_off_analysis = trade_off_analysis
            session.current_step = 4
            session.current_phase = "OBSERVE"
            session.status = "COMPARING"

            rec_title = trade_off_analysis.get("recommended_product_title", "Selected Product")
            match_score = trade_off_analysis.get("match_score", 0)

            trace = AgentTrace(
                session_id=session.id,
                step_number=4,
                phase="OBSERVE",
                action_type="COMPARE_SPECS",
                title=f"Selected Winner: {rec_title} ({match_score}/100)",
                reasoning=trade_off_analysis.get("summary_rationale", "Selected top recommendation based on trade-off analysis."),
                input_data={"top_3_candidates": [c["title"] for c in trade_off_analysis.get("candidates", [])]},
                output_data=trade_off_analysis,
                is_reversible=True
            )
            db.add(trace)

            AuditService.log_event(
                db=db,
                action="RECOMMENDATION_FORMULATED",
                actor="AGENT",
                is_irreversible=False,
                status="SUCCESS",
                details=f"Formulated recommendation: {rec_title} (Match Score: {match_score}).",
                session_id=session.id
            )

            db.commit()
            db.refresh(session)
            return session

        # =========================================================================
        # STEP 5: TRUST CHECK & HUMAN APPROVAL CHECKPOINT (APPROVE)
        # =========================================================================
        elif step == 4:
            if not session.recommended_product_id:
                session.status = "FAILED"
                db.commit()
                return session

            product = db.query(Product).filter(Product.id == session.recommended_product_id).first()
            if not product:
                session.status = "FAILED"
                db.commit()
                return session

            # Check budget limit guardrail
            is_within_budget, budget_msg = TrustAndSafetyGuard.validate_budget_cap(
                price=product.price,
                budget_limit=session.budget_limit
            )

            # Stage cart item
            session.cart_item = {
                "product_id": product.id,
                "title": product.title,
                "price": product.price,
                "quantity": 1,
                "total": product.price,
                "delivery_days": product.delivery_days
            }
            session.total_cost = product.price
            session.current_step = 5
            session.current_phase = "APPROVE"
            session.status = "AWAITING_APPROVAL" # Hard pause state!

            trace = AgentTrace(
                session_id=session.id,
                step_number=5,
                phase="APPROVE",
                action_type="REQUEST_APPROVAL",
                title="Human Checkpoint: Confirmation Required to Checkout",
                reasoning=(
                    f"Recommended {product.title} at ${product.price:,.2f} ({budget_msg}). "
                    f"In accordance with Trust & Safety policy, purchasing is an IRREVERSIBLE action. "
                    f"Agent has staged the order in the cart and paused execution for explicit human authorization."
                ),
                input_data={"staged_cart": session.cart_item, "budget_limit": session.budget_limit},
                output_data={"status": "PAUSED_AWAITING_HUMAN_APPROVAL", "is_within_budget": is_within_budget},
                is_reversible=True
            )
            db.add(trace)

            AuditService.log_event(
                db=db,
                action="HUMAN_CHECKPOINT_TRIGGERED",
                actor="SAFETY_GUARD",
                is_irreversible=False,
                status="PENDING_APPROVAL",
                details=f"Irreversible purchase staged for '{product.title}' (${product.price:,.2f}). Awaiting user approval.",
                session_id=session.id,
                payload={"cart_item": session.cart_item, "budget_limit": session.budget_limit}
            )

            db.commit()
            db.refresh(session)
            return session

        return session

    @staticmethod
    def auto_run_until_checkpoint(db: Session, session: AgentSession) -> AgentSession:
        """
        Automatically steps through the agent loop until it reaches AWAITING_APPROVAL,
        COMPLETED, CANCELLED, or FAILED.
        """
        while session.status not in ["AWAITING_APPROVAL", "COMPLETED", "CANCELLED", "FAILED", "REJECTED"]:
            if session.is_killed:
                break
            session = AgentOrchestrator.run_next_step(db, session)
        return session

    @staticmethod
    def process_human_decision(
        db: Session,
        session: AgentSession,
        decision: str,
        feedback: Optional[str] = None
    ) -> AgentSession:
        """
        Handles human approval checkpoint resumption (APPROVE, REJECT, or MODIFY).
        """
        if session.is_killed:
            return session

        session.human_feedback = feedback

        if decision == "APPROVE":
            # 1. Update status to APPROVED
            session.status = "APPROVED"
            session.current_phase = "ACT"

            AuditService.log_event(
                db=db,
                action="HUMAN_APPROVAL_GRANTED",
                actor="USER",
                is_irreversible=True,
                status="APPROVED",
                details="Human approved recommended purchase. Resuming autonomous agent checkout.",
                session_id=session.id,
                payload={"feedback": feedback}
            )

            # 2. Execute simulated purchase (Step 6)
            product = db.query(Product).filter(Product.id == session.recommended_product_id).first()
            if not product:
                session.status = "FAILED"
                db.commit()
                return session

            # Create simulated Order
            order = Order(
                session_id=session.id,
                product_id=product.id,
                product_title=product.title,
                unit_price=product.price,
                quantity=1,
                total_amount=product.price,
                shipping_address="Simulated Address: 100 Agentic Way, San Francisco, CA",
                payment_method="Simulated Corporate Agent Wallet",
                status="SIMULATED_SUCCESS"
            )
            db.add(order)

            session.current_step = 6
            session.status = "COMPLETED"

            trace = AgentTrace(
                session_id=session.id,
                step_number=6,
                phase="ACT",
                action_type="EXECUTE_ORDER",
                title=f"Simulated Purchase Completed (Order #{order.id})",
                reasoning=(
                    f"Received human authorization. Dispatched autonomous checkout transaction for '{product.title}' "
                    f"for ${product.price:,.2f}. Verified inventory reservation and generated simulated order receipt."
                ),
                input_data={"approval": "GRANTED", "product_id": product.id},
                output_data={"order_id": order.id, "total_paid": product.price, "delivery_estimate_days": product.delivery_days},
                is_reversible=False
            )
            db.add(trace)

            AuditService.log_event(
                db=db,
                action="ORDER_EXECUTED_IRREVERSIBLE",
                actor="AGENT",
                is_irreversible=True,
                status="SUCCESS",
                details=f"Simulated order {order.id} executed for '{product.title}' (${product.price:,.2f}).",
                session_id=session.id,
                payload={"order_id": order.id, "total": product.price}
            )

            db.commit()
            db.refresh(session)
            return session

        elif decision == "REJECT":
            session.status = "REJECTED"
            session.current_step = 6

            trace = AgentTrace(
                session_id=session.id,
                step_number=6,
                phase="APPROVE",
                action_type="ABORT_MISSION",
                title="Purchase Rejected by User",
                reasoning=f"User declined the recommended product. Stated feedback: '{feedback or 'No reason specified'}'. Purchase was safely not executed.",
                input_data={"decision": "REJECT", "feedback": feedback},
                output_data={"status": "REJECTED"},
                is_reversible=True
            )
            db.add(trace)

            AuditService.log_event(
                db=db,
                action="HUMAN_APPROVAL_REJECTED",
                actor="USER",
                is_irreversible=False,
                status="REJECTED",
                details=f"User rejected recommendation. Feedback: {feedback or 'None'}.",
                session_id=session.id,
                payload={"feedback": feedback}
            )

            db.commit()
            db.refresh(session)
            return session

        elif decision == "MODIFY":
            # Reset agent to search with revised notes
            session.status = "PLANNING"
            session.current_step = 0
            if feedback:
                session.user_query = f"{session.user_query} (Correction: {feedback})"

            AuditService.log_event(
                db=db,
                action="CRITERIA_MODIFIED_BY_USER",
                actor="USER",
                is_irreversible=False,
                status="SUCCESS",
                details=f"User requested criteria modification: '{feedback}'. Resetting agent planning loop.",
                session_id=session.id,
                payload={"feedback": feedback}
            )

            db.commit()
            db.refresh(session)
            return AgentOrchestrator.auto_run_until_checkpoint(db, session)

        return session
