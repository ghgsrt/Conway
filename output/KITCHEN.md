---
aliases: ['KITCHEN', 'Kitchen']
tags: [room]
IN: ROOMS
DESC: "Kitchen"
EAST: EAST-OF-HOUSE IF KITCHEN-WINDOW=OPEN
WEST: LIVING-ROOM
OUT: EAST-OF-HOUSE IF KITCHEN-WINDOW=OPEN
UP: ATTIC
ACTION: KITCHEN-FCN
FLAGS: ['RLANDBIT', 'ONBIT', 'SACREDBIT']
VALUE: 10
GLOBAL: KITCHEN-WINDOW CHIMNEY STAIRS
---
