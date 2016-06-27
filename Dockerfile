FROM centos/python-27-centos7

ADD . /opt/squirrel

CMD python /opt/squirrel/app.py
