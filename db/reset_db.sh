#!/bin/bash

psql -U postgres -d employee_tracker -f db/schema.sql
psql -U postgres -d employee_tracker -f db/seeds.sql