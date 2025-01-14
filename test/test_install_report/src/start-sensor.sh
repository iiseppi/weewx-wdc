#!/bin/bash

# start rsyslog
echo 'Starting rsyslog'
# remove lingering pid file
rm -f /run/rsyslogd.pid
# start service
service rsyslog start


mv "${WEEWX_HOME}"/archive/weewx-sensor-status.sdb "${WEEWX_HOME}"/archive/weewx.sdb
mv "${WEEWX_HOME}"/skins/weewx-wdc/skin-sensor-status.conf "${WEEWX_HOME}"/skins/weewx-wdc/skin.conf

# start weewx
echo 'Starting weewx reports (sensor status)'
"${WEEWX_HOME}"/bin/wee_reports
cat /var/log/syslog | grep weewx