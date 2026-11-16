# Migration order

U3-B starts from the consolidated root database/init.sql, not from MySQL SQL.
All current additions are already included. There are ZERO incremental migrations
yet; reapplying copies of existing DDL would be redundant and unsafe.
Future changes must start at 001_<purpose>.sql, followed by 002_, etc., with
checksums, transaction/error behavior and application privileges reviewed.

This directory contains no executable migration until a real PostgreSQL runtime
is available and the fresh baseline has been validated.
