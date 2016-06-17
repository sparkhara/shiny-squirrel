FROM python:2.7.11

ADD . /opt/squirrel

RUN pip install -r /opt/squirrel/requirements.txt

CMD /opt/squirrel/start-shiny-squirrel.sh
