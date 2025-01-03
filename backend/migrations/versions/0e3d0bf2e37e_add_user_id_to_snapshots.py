"""add user_id to snapshots

Revision ID: 0e3d0bf2e37e
Revises: 47cecc079359
Create Date: 2024-12-26 00:04:31.213456

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0e3d0bf2e37e'
down_revision: Union[str, None] = '47cecc079359'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('snapshots', sa.Column('user_id', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('snapshots', 'user_id')
    # ### end Alembic commands ###
