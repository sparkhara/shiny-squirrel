FROM centos/python-27-centos7

ADD . /opt/squirrel

RUN pip install -y /opt/squirrel/requirements.txt

CMD python /opt/squirrel/app.py
