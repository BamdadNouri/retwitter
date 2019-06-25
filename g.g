Last login: Mon Jun 24 10:53:05 on ttys000

bamdad on  master [!?] via ⬢ v10.15.3
➜ cqlsh
Connected to Test Cluster at 127.0.0.1:9042.
[cqlsh 5.0.1 | Cassandra 3.11.4 | CQL spec 3.4.4 | Native protocol v4]
Use HELP for help.
cqlsh> use retweeter
   ... efe;
Improper use command.
cqlsh> USE retwitter;
cqlsh:retwitter> DROP TABLE tweets;
cqlsh:retwitter> CREATE TABLE tweets(id text,userId text,body text,tstamp timestamp,likes set<text>,pointTo text,PRIMARY KEY((userId), id))WITH CLUSTERING ORDER BY(tstamp DESC);
InvalidRequest: Error from server: code=2200 [Invalid query] message="Missing CLUSTERING ORDER for column id"
cqlsh:retwitter> CREATE TABLE tweets(id text,userId text,body text,tstamp timestamp,likes set<text>,pointTo text,PRIMARY KEY((userId, tstamp), id))WITH CLUSTERING ORDER BY(tstamp DESC);
InvalidRequest: Error from server: code=2200 [Invalid query] message="Missing CLUSTERING ORDER for column id"
cqlsh:retwitter> CREATE TABLE tweets(id text,userId text,body text,tstamp timestamp,likes set<text>,pointTo text,PRIMARY KEY((userId), id)) WITH CLUSTERING ORDER BY(tstamp DESC);
InvalidRequest: Error from server: code=2200 [Invalid query] message="Missing CLUSTERING ORDER for column id"
cqlsh:retwitter> CREATE TABLE tweets(id text,userId text,body text,tstamp timestamp,likes set<text>,pointTo text,PRIMARY KEY((userId), id)) WITH CLUSTERING ORDER BY(tstamp DESC, id ASC);
InvalidRequest: Error from server: code=2200 [Invalid query] message="Only clustering key columns can be defined in CLUSTERING ORDER directive"
cqlsh:retwitter> CREATE TABLE tweets(id text,userId text,body text,tstamp timestamp,likes set<text>,pointTo text,PRIMARY KEY((userId, tstamp), id)) WITH CLUSTERING ORDER BY(tstamp DESC, id ASC);
InvalidRequest: Error from server: code=2200 [Invalid query] message="Only clustering key columns can be defined in CLUSTERING ORDER directive"
cqlsh:retwitter> CREATE TABLE tweets(id text,userId text,body text,tstamp timestamp,likes set<text>,pointTo text,PRIMARY KEY((id, tstamp), userId)) WITH CLUSTERING ORDER BY(tstamp DESC, id ASC);
InvalidRequest: Error from server: code=2200 [Invalid query] message="Only clustering key columns can be defined in CLUSTERING ORDER directive"
cqlsh:retwitter> CREATE TABLE tweets(id text,userId text,body text,tstamp timestamp,likes set<text>,pointTo text,PRIMARY KEY((id, tstamp), userId)) WITH CLUSTERING ORDER BY(id DESC);
InvalidRequest: Error from server: code=2200 [Invalid query] message="Missing CLUSTERING ORDER for column userid"
cqlsh:retwitter> CREATE TABLE tweets(id text,userId text,body text,tstamp timestamp,likes set<text>,pointTo text,PRIMARY KEY((id, tstamp), userId)) WITH CLUSTERING ORDER BY(userId DESC);
cqlsh:retwitter> DROP TABLE tweets
             ... ;
cqlsh:retwitter> CREATE TABLE tweets(id text,userId text,body text,tstamp timestamp,likes set<text>,pointTo text,PRIMARY KEY((id), userId));
cqlsh:retwitter> INSERT INTO tweets(id,userid,body,tstamp,likes,pointTo) VALUES('1','g','boddd','2019-06-23T19:06:55.422Z', null,'none)'
             ... ;
SyntaxException: line 2:0 mismatched input ';' expecting ')' (...,'boddd','2019-06-23T19:06:55.422Z', null,'none)'[;])
cqlsh:retwitter> INSERT INTO tweets(id,userid,body,tstamp,likes,pointTo) VALUES('1','g','boddd','2019-06-23T19:06:55.422Z', {},'none)' ;
SyntaxException: line 1:118 mismatched input ';' expecting ')' (...'boddd','2019-06-23T19:06:55.422Z', {},'none)' [;])
cqlsh:retwitter> INSERT INTO tweets(id,userid,body,tstamp,likes,pointTo) VALUES('1','g','boddd','2019-06-23T19:06:󐁥5.422Z', {},'none)' ;
SyntaxException: line 1:118 mismatched input ';' expecting ')' (...'boddd','2019-06-23T19:06:55.422Z', {},'none)' [;])
cqlsh:retwitter> INSERT INTO tweets(id,userid,body,tstamp,likes,pointTo) VALUES('1','g','boddd','2019-06-23T19:06:55.422Z', {},'none)';
SyntaxException: line 1:117 mismatched input ';' expecting ')' (...,'boddd','2019-06-23T19:06:55.422Z', {},'none)'[;])
cqlsh:retwitter> INSERT INTO tweets(id,userid,body,tstamp,likes,pointTo) VALUES('1','g','boddd','2019-06-23T19:06:55.422Z', {},'none');
cqlsh:retwitter> SELECT * from tweets
             ... ;

 id | userid | body  | likes | pointto | tstamp
----+--------+-------+-------+---------+---------------------------------
  1 |      g | boddd |  null |    none | 2019-06-23 19:06:55.422000+0000

(1 rows)
cqlsh:retwitter> SELECT * from tweets WHERE id='1';

 id | userid | body  | likes | pointto | tstamp
----+--------+-------+-------+---------+---------------------------------
  1 |      g | boddd |  null |    none | 2019-06-23 19:06:55.422000+0000

(1 rows)
cqlsh:retwitter> SELECT * from tweets WHERE userId='g';
InvalidRequest: Error from server: code=2200 [Invalid query] message="Cannot execute this query as it might involve data filtering and thus may have unpredictable performance. If you want to execute this query despite the performance unpredictability, use ALLOW FILTERING"
cqlsh:retwitter> SELECT * from tweets WHERE userId='g' AND id='1';

 id | userid | body  | likes | pointto | tstamp
----+--------+-------+-------+---------+---------------------------------
  1 |      g | boddd |  null |    none | 2019-06-23 19:06:55.422000+0000

(1 rows)
cqlsh:retwitter> DROP TABLE tweets
             ... ;
cqlsh:retwitter> CREATE TABLE tweets(id text,userId text,body text,tstamp timestamp,likes set<text>,pointTo text,PRIMARY KEY((id, body), userId));
cqlsh:retwitter> INSERT INTO tweets(id,userid,body,tstamp,likes,pointto) VALUES('1','g','boddd','2019-06-23T19:06:55.422Z',{},'none');
cqlsh:retwitter> SELECT * from tweets ;

 id | body  | userid | likes | pointto | tstamp
----+-------+--------+-------+---------+---------------------------------
  1 | boddd |      g |  null |    none | 2019-06-23 19:06:55.422000+0000

(1 rows)
cqlsh:retwitter> SELECT * from tweets WHERE id='1';
InvalidRequest: Error from server: code=2200 [Invalid query] message="Cannot execute this query as it might involve data filtering and thus may have unpredictable performance. If you want to execute this query despite the performance unpredictability, use ALLOW FILTERING"
cqlsh:retwitter> SELECT * from tweets WHERE userid='g';
InvalidRequest: Error from server: code=2200 [Invalid query] message="Cannot execute this query as it might involve data filtering and thus may have unpredictable performance. If you want to execute this query despite the performance unpredictability, use ALLOW FILTERING"
cqlsh:retwitter> SELECT * from tweets WHERE body='boddd';
InvalidRequest: Error from server: code=2200 [Invalid query] message="Cannot execute this query as it might involve data filtering and thus may have unpredictable performance. If you want to execute this query despite the performance unpredictability, use ALLOW FILTERING"
cqlsh:retwitter> SELECT * from tweets WHERE body='boddd' AND id='1';

 id | body  | userid | likes | pointto | tstamp
----+-------+--------+-------+---------+---------------------------------
  1 | boddd |      g |  null |    none | 2019-06-23 19:06:55.422000+0000

(1 rows)
cqlsh:retwitter> DROP TABLE tweets ;
cqlsh:retwitter> CREATE TABLE tweets(id text,userId text,body text,tstamp timestamp,likes set<text>,pointTo text,PRIMARY KEY((id),(body), userId));
SyntaxException: line 1:113 no viable alternative at input '(' (...text,PRIMARY KEY((id),[(]...)
cqlsh:retwitter> CREATE TABLE tweets(id text,userId text,body text,tstamp timestamp,likes set<text>,pointTo text,PRIMARY KEY((id),body, userId));
cqlsh:retwitter> INSERT INTO tweets(id,userid,body,tstamp,likes,pointto) VALUES('1','g','boddd','2019-06-23T19:06:55.422Z',{},'none');
cqlsh:retwitter> SELECT * from tweets ;

 id | body  | userid | likes | pointto | tstamp
----+-------+--------+-------+---------+---------------------------------
  1 | boddd |      g |  null |    none | 2019-06-23 19:06:55.422000+0000

(1 rows)
cqlsh:retwitter> SELECT * from tweets WHERE body='boddd';
InvalidRequest: Error from server: code=2200 [Invalid query] message="Cannot execute this query as it might involve data filtering and thus may have unpredictable performance. If you want to execute this query despite the performance unpredictability, use ALLOW FILTERING"
cqlsh:retwitter> SELECT * from tweets WHERE body='boddd' AND id='1';

 id | body  | userid | likes | pointto | tstamp
----+-------+--------+-------+---------+---------------------------------
  1 | boddd |      g |  null |    none | 2019-06-23 19:06:55.422000+0000

(1 rows)
cqlsh:retwitter> SELECT * from tweets WHERE userid='g';
InvalidRequest: Error from server: code=2200 [Invalid query] message="PRIMARY KEY column "userid" cannot be restricted as preceding column "body" is not restricted"
cqlsh:retwitter> SELECT * from tweets WHERE body='boddd' AND userid='g';
InvalidRequest: Error from server: code=2200 [Invalid query] message="Cannot execute this query as it might involve data filtering and thus may have unpredictable performance. If you want to execute this query despite the performance unpredictability, use ALLOW FILTERING"
cqlsh:retwitter> SELECT * from tweets WHERE id='1' AND userid='g';
InvalidRequest: Error from server: code=2200 [Invalid query] message="PRIMARY KEY column "userid" cannot be restricted as preceding column "body" is not restricted"
cqlsh:retwitter> DROP TABLE tweets ;
cqlsh:retwitter> CREATE TABLE tweets(id text,userId text,body text,tstamp timestamp,likes set<text>,pointTo text,PRIMARY KEY((id), userId));
cqlsh:retwitter> INSERT INTO tweets(id,userid,body,tstamp,likes,pointto) VALUES('1','g','boddd','2019-06-23T19:06:55.422Z',{},'none');
cqlsh:retwitter> SELECT * from tweets WHERE id='1';

 id | userid | body  | likes | pointto | tstamp
----+--------+-------+-------+---------+---------------------------------
  1 |      g | boddd |  null |    none | 2019-06-23 19:06:55.422000+0000

(1 rows)
cqlsh:retwitter> SELECT * from tweets WHERE userId='g';
InvalidRequest: Error from server: code=2200 [Invalid query] message="Cannot execute this query as it might involve data filtering and thus may have unpredictable performance. If you want to execute this query despite the performance unpredictability, use ALLOW FILTERING"
cqlsh:retwitter> INSERT INTO tweets(id,userid,body,tstamp,likes,pointto) VALUES('1','g','boddd','2019-06-23T19:06:55.422Z',{},'none');  CREATE TABLE tweets(id text,userId text,body text,tstamp timestamp,likes set<text>,pointTo text,PRIMARY KEY((id), userISELECT * from tweets WHERE body='boddd' AND userid='g';
InvalidRequest: Error from server: code=2200 [Invalid query] message="Cannot execute this query as it might involve data filtering and thus may have unpredictable performance. If you want to execute this query despite the performance unpredictability, use ALLOW FILTERING"
cqlsh:retwitter> DROP TABLE tweets ;                                                                                   cqlsh:retwitter>
cqlsh:retwitter> CREATE TABLE tweets(id text,userId text,body text,tstamp timestamp,likes set<text>,pointTo text,PRIMARY KEY((userId), id));
cqlsh:retwitter> INSERT INTO tweets(id,userid,body,tstamp,likes,pointto) VALUES('1','g','boddd','2019-06-23T19:06:55.422Z',{},'none');
cqlsh:retwitter> DROP TABLE tweets ;
cqlsh:retwitter> CREATE TABLE tweets(id text,userId text,body text,tstamp timestamp,likes set<text>,pointTo text,PRIMARY KEY((userId), id)) WITH CLUSTERING ORDER BY(id DESC);
cqlsh:retwitter> INSERT INTO tweets(id,userid,body,tstamp,likes,pointto) VALUES('1','g','boddd','2019-06-23T19:06:55.422Z',{},'none');                                cqlsh:retwitter> SELECT * from tweets
             ... ;

 userid | id | body  | likes | pointto | tstamp
--------+----+-------+-------+---------+---------------------------------
      g |  1 | boddd |  null |    none | 2019-06-23 19:06:55.422000+0000
                 CREATE TABLE tweets(id text,userId text,body text,tstamp timestamp,likes set<text>,pointTo text,PRIMARY KEY((userId), id));
AlreadyExists: Table 'retwitter.tweets' already exists
cqlsh:retwitter> CREATE TABLE tweets(id text,userId text,body text,tstamp timestamp,likes set<text>,pointTo text,PRIMARY KEY((userId), id)) WITH CLUSTERING O
cqlsh:retwitter>
cqlsh:retwitter> DROP TABLE tweets ;
cqlsh:retwitter> CREATE TABLE tweets(id text,userId text,body text,tstamp text,likes set<text>,pointTo text,PRIMARY KEY((userId), id));
cqlsh:retwitter> INSERT INTO tweets(id,userid,body,tstamp,likes,pointto) VALUES('1','g','boddd','2019-06-23T19:06:55.422Z',{},'none');
cqlsh:retwitter> DROP TABLE users;
cqlsh:retwitter> CREATE TABLE users(id text,username text,password text,email text,bio text, followers set<text>,followings set<text>,PRIMARY KEY(username));
cqlsh:retwitter> DROP TABLE users;
cqlsh:retwitter> CREATE TABLE users(id text,username text,password text,email text,bio text, followers set<text>,followings set<text>,PRIMARY KEY(id));
cqlsh:retwitter>