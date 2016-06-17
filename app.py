import os
import sys

import shiny_squirrel


mongo_url = os.getenv('SHINY_SQUIRREL_MONGO_URL')
if mongo_url is None:
    print('SHINY_SQUIRREL_MONGO_URL not provided')
    sys.exit(-1)

# mongodb_service_name = os.getenv('MONGODB_SERVICE_NAME')
# if mongodb_service_name is None:
#     print('MONGODB_SERVICE_NAME not provided')
#     sys.exit(-1)

# mongodb_username = open('/etc/mongo-secret/username').read()
# mongodb_password = open('/etc/mongo-secret/password').read()

# mongo_url = 'mongodb://{user}:{password}@{service}/sparkhara'.format(
#             user=mongodb_username,
#             password=mongodb_password,
#             service=mongodb_service_name)

shiny_squirrel.main(mongo_url)
