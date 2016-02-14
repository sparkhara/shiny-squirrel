shiny squirrel
==============

this is a flask application for displaying some log data

installation and execution
--------------------------

this application is intended to be built as an openshift
source-to-image image. for more information on source-to-image, please
see https://github.com/openshift/source-to-image

to build and run this application with s2i and docker, use the
following commands (or something similar to your settings):

::

    $ s2i build https://github.com/sparkhara/shiny-squirrel \
      openshift/python-27-centos7 shiny-squirrel-centos7

    (... lots of build exhaust ...)

    $ docker run --rm -i -t -p 9050:9050 \
      -v /secrets/dir:/etc/mongo-secret \
      -e MONGODB_SERVICE_NAME=localhost \
      shiny-squirrel-centos7

    (log output from shiny-squirrel)


rest api
--------

the routes available

index
~~~~~

**Request**

::

    GET /

**Response**

a web page with the graph of counts

log count packets
~~~~~~~~~~~~~~~~~

**Request**

::

    GET /count-packets

**Response**

::

    200

    {
      "count-packets": {
        "last-received": {
          "count": 0,
          "id": null,
          "service-counts": {
              "<service name>": 0
          }
        },
        "history": [
          {
            "count": 0,
            "ids": [],
            "service-counts": {
                "<service name>": 0
            }
          }
        ]
      }
    }

**Request**

::

    POST /count-packets

    {
      "id": null,
      "count": 0
    }

**Response**

::

    201

**Request**

::

    GET /count-packets/{packet_id}

**Response**

::

    200

    {
      "count-packet": {
        "id": null,
        "logs": []
      }
    }

sorted log lines
~~~~~~~~~~~~~~~~

**Request**

::

    GET /sorted-logs?ids={count packet id 1}&...&ids={count packet id n}

**Response**

::

    200

    {
      "sorted-logs": {
        "lines": []
      }
    }

totals
~~~~~~

**Request**

::

    GET /totals

**Response**

::

    200

    {
      "totals": {
        "all": 0
      }
    }

