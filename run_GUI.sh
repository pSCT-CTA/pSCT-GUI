#!/bin/bash

create_gui_env() {
    # Set up Tensorflow
    #export PATH="/home/shevek/software/anaconda3/bin:$PATH";
    #source activate ctlearn;

    # Open Tensorboard
    #echo "Local TensorBoard address is http://0.0.0.0:6007";
    #cd /home/shevek/brill/logs/;
    #cd /data0/logs/icrc2019/;#190626_speed/;
    #tensorboard --logdir=. --port=6007;
    source ~/repos/bryan/pSCT-GUI/gui_start.sh backend
    source ~/repos/bryan/pSCT-GUI/gui_start.sh gui
}

# Bind the address of tensorflow running on shevek on port 6007 to the
# corresponding port on tehanu and the local machine
# Use declare to transfer the function defintions to the remote shells

#ssh -t -L 6007:0.0.0.0:6007 brill@tehanu.nevis.columbia.edu "$(declare -f open_tensorboard); ssh -t -L 6007:0.0.0.0:6007 shevek@shevek \"$(declare -f open_tensorboard); open_tensorboard\""
ssh -t -L 8000:127.0.0.1:8000 ctauser@172.17.10.15 "$(declare -f create_gui_env); create_gui_env"

