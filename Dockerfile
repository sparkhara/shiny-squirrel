FROM centos/python-27-centos7

ADD . /opt/squirrel

RUN /opt/rh/python27/root/usr/bin/pip install -r /opt/squirrel/requirements.txt

CMD python /opt/squirrel/app.py
