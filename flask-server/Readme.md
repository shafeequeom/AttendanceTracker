# REST API With Flask & SQL Alchemy

> Attendance API using Python Flask, SQL Alchemy and Marshmallow

## Quick Start Using Pipenv
```
pip install pipenv
```

``` bash
# Activate venv
```
pipenv shell
```

# Install dependencies
```
pipenv install
```

# Create DB
```
python db_init.py
```

# Run Server (http://localhst:5000)
```
python app.py
```

## Endpoints

* POST    /attendances   (Exit/Entry register api)
* GET     /attendances (Today's attendance log)
* GET     /attendances/current (Get active entry logs)

