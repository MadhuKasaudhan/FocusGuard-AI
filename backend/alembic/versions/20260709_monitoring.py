"""Add monitoring tables for screen time and task switches

Revision ID: 20260709_monitoring
Revises: 20260709_initial
Create Date: 2026-07-09 00:05:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "20260709_monitoring"
down_revision = "20260709_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "screen_time_events",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("duration_seconds", sa.Integer(), nullable=True),
        sa.Column("captured_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("window_title", sa.String(length=255), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_screen_time_events_id"), "screen_time_events", ["id"], unique=False)

    op.create_table(
        "task_switch_events",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("previous_task", sa.String(length=255), nullable=True),
        sa.Column("next_task", sa.String(length=255), nullable=True),
        sa.Column("switched_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_task_switch_events_id"), "task_switch_events", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_task_switch_events_id"), table_name="task_switch_events")
    op.drop_table("task_switch_events")
    op.drop_index(op.f("ix_screen_time_events_id"), table_name="screen_time_events")
    op.drop_table("screen_time_events")
