#! /usr/bin/env python
# -*- coding:utf-8 -*-

# ------------------------------------------------------------------------------
# This script is made for ET 2012 Demo. (2012/10/25)
# This script gets D-Control script from client and sends it to D-Controller.
# ------------------------------------------------------------------------------

import urllib, urllib2
import cgi, uuid, sys, os, json, re, commands
import cgitb
cgitb.enable();

### Config
#RiskDB_ip = 'http://127.0.0.1:8000/'
RiskDB_ip = 'http://192.168.59.150:8000/'

def keyword2riskexpression(keyword):
	req = RiskDB_ip + "alertme/api/1.0/search_with_word.json?query=" + keyword
	res = json.loads(urllib.urlopen(req).read())
	ret = {'keyword':res["keyword"], 'count':res["count"], "words":[]}
	for risk in res["risks"]:
		ret["words"].append(risk["words"])
	return ret

def returnClient(risks):
	print('Content-Type: application/json')
	print('')
	print(json.dumps({'risks': risks}, indent=4))

def main():
	form = cgi.FieldStorage()
	script = form.getvalue('Script')
	#cmds = commands.getoutput("ls").split("\n")
	cmds = ["RFP", "顧客"]
	#cmds = ["作業タスク"]
	risks = []
	for cmd in cmds:
		rxp = keyword2riskexpression(cmd)
		if rxp["count"] != 0:
			risks.append(rxp)
	returnClient(risks)

if __name__ == "__main__":
	main()
