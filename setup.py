import os

from setuptools import setup, find_packages

requires = []

tests_require = [
    'WebTest >= 1.3.1',  # py3 compat
    'pytest',
    'pytest-cov',
]

setup(
    name='psct_gui',
    version='0.1.0',
    description='pSCT Alignment Control GUI',
    long_description='',
    classifiers=[
        'Programming Language :: Python',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: WSGI :: Application',
    ],
    author='Bryan Kim',
    author_email='bryan.sanghyuk.kim@gmail.com',
    url='',
    keywords='web',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=[
          'opcua>=0.98.5',
          'eventlet>=0.24.1',
          'python_socketio>=2.0.0', 'socketio'
     ],
    extras_require={
        'testing': tests_require,
    }
)
