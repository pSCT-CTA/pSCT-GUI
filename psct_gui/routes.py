def includeme(config):
    config.add_static_view('static', path='psct_gui:static', cache_max_age=3600)
    config.add_static_view('dist', path='psct_gui:dist', cache_max_age=3600)
    config.add_route('home', '/')
    config.add_route('dashboard', '/dashboard')
    config.add_route('login', '/login')
    config.add_route('logout', '/logout')
