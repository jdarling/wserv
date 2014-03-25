wserv
====

Simple stupid static web server based on Connect, Liftoff, and Commander.

Install
-------

      npm install -g wserv

Usage
------

Navigate to the folder containing your HTML/JS/CSS source and execute:

```
wserv [options]
```

Options
=======

```
-h, --help          output usage information
-v, --version       output the version number
-p, --port <int>    Set port to serve on, default 8080
-f, --folder <int>  Set directory to serve from, default <Current Folder>
```

Configuration
=============

You can always place a wserv.json file in any folder to configure wserv's options.  This file should follow:

```json
{
  "port": 8080,
  "folder": "../path/relative/to/wserv.json/file",
  "name": "Some Name"
}
```