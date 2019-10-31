# Introduction

This is the portal interface for iTHRIV, a Translational Medicine service that will provide a searchable, browsable index of resources/events/datasets and many more avaialable to reseachers, clinicians and the public with the intention to improve access and improve health care in our community.

### Prerequisites

Docker Engine

### Starting the interface

```BASH
docker-compose build
docker-compose start
```

### Stopping the interface

```BASH
docker-compose stop
```

### Security / Authentication

At present the system handles single sign on (SSO) authentication through Shibboleth.
