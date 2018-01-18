#!/bin/bash
#
# tconsul        Manage the consul agent
#
# chkconfig:   2345 91 10
# description: Consul is a tool for service discovery and configuration
# processname: consul
# config: /opt/tvault/consul/client/config.json
# pidfile: /opt/tvault/consul/consul.pid


consulhome="/opt/tvault/consul"
prog="consul"
user="tvault"
exec="$consulhome/$prog"
pidfile="$consulhome/$prog.pid"
lockfile="$consulhome/$prog.lock"
logfile="/var/log/tvault/$prog.log"
confdir="$consulhome/client"

# pull in sysconfig settings
[ -e $consulhome/$prog.sysconfig ] && . $consulhome/$prog.sysconfig

export GOMAXPROCS=${GOMAXPROCS:-2}

start() {
    [ -x $exec ] || exit 5
    [ -d $confdir ] || exit 6

    umask 077

    touch $logfile $pidfile
    chown $user:$user $logfile $pidfile

    echo -n $"Starting $prog: "
    
    $exec agent -config-dir=$confdir 2>&1 >> $logfile &
    RETVAL=$?

    echo $! > $pidfile

    echo ""

    if [ $RETVAL -eq 0 ]; then
        touch $lockfile
        echo "Consul started ..."
    else
        echo "Error starting Consul"
    fi

    sleep 2
    return $RETVAL
}

stop() {
    echo -n $"Shutting down $prog: "
    ## graceful shutdown with SIGINT
    kill -2 $(cat $pidfile) >> $logfile
    RETVAL=$?

    echo ""
    [ $RETVAL -eq 0 ] && rm -f $lockfile

    return $RETVAL
}

restart() {
    stop
    sleep 5
    start
}

status() {

    echo "Members"
    echo "======="
    $exec members

    echo "Info"
    echo "===="
    $exec info

}

case "$1" in
    start)
        $1
        ;;
    stop)
        $1
        ;;
    restart)
        $1
        ;;
    status)
        $1
        ;;
    *)
        echo $"Usage: $0 {start|stop|status|restart}"
        exit 2
esac

exit $?