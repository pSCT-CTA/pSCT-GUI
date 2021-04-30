
process_type=$1

CONDABIN=~/miniconda3/bin
GUI_BACKEND=~/repos/bryan/pSCT-GUI/psct_gui_backend/
GUI_DIR=~/repos/bryan/pSCT-GUI/psct_gui/

export PATH=$CONDABIN:$PATH

if [[ "$process_type" == "backend" ]] ; then
        cd $GUI_BACKEND 
        $CONDABIN/python3 core.py --debug opc.tcp://172.17.10.15:48010 
elif [[ "$process_type" == "gui" ]] ; then
        cd $GUI_DIR
        $CONDABIN/npm start 
elif [[ "$process_type" == "open" ]] ;  then
    firefox http://127.0.0.1:8081
fi
