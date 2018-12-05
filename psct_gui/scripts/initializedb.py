import os
import sys
import transaction

from pyramid.paster import (
    get_appsettings,
    setup_logging,
    )

from pyramid.scripts.common import parse_vars

from psct_gui.models.meta import Base
from psct_gui.models import (
    get_engine,
    get_session_factory,
    get_tm_session,
    )
from psct_gui.models import User


def usage(argv):
    cmd = os.path.basename(argv[0])
    print('usage: %s <config_uri> [var=value]\n'
          '(example: "%s development.ini")' % (cmd, cmd))
    sys.exit(1)


def main(argv=sys.argv):
    if len(argv) < 2:
        usage(argv)
    config_uri = argv[1]
    options = parse_vars(argv[2:])
    setup_logging(config_uri)
    settings = get_appsettings(config_uri, options=options)

    # Get engine (pointing at config uri)
    engine = get_engine(settings)

    # Create all tables
    Base.metadata.create_all(engine)

    session_factory = get_session_factory(engine)

    with transaction.manager:
        # get db session
        dbsession = get_tm_session(session_factory, transaction.manager)

        user1 = User(username='test_user', role='user')
        user1.set_password("user")
        dbsession.add(user1)

        user2 = User(username='test_admin', role='admin')
        user2.set_password("admin")
        dbsession.add(user2)
