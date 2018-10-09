from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    Text,
    DateTime,
)
from sqlalchemy.orm import relationship

from .meta import Base


class HistoryEntry(Base):
    """ The SQLAlchemy declarative model class for a History entry object. """
    __tablename__ = 'history'

    timestamp = Column(DateTime, primary_key=True)
    username = Column(ForeignKey('users.username'), primary_key=True)
    entry_type = Column(Text, nullable=False, primary_key=True)
    entry_info = Column(Text, nullable=False, primary_key=True)

    user = relationship('User', backref='entry')
