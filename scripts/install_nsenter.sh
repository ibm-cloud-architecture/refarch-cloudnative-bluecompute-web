#!/bin/bash
# Install
sudo apt-get install -y build-essential libncurses5-dev libslang2-dev gettext zlib1g-dev \
libselinux1-dev debhelper lsb-release pkg-config po-debconf autoconf \
automake autopoint libtool python2.7-dev

# Download the util-linux package source code (this contains nsenter)
cd /tmp
wget https://www.kernel.org/pub/linux/utils/util-linux/v2.25/util-linux-2.25.tar.gz
tar -xvf util-linux-2.25.tar.gz

# Now we’ll compile the nsenter program
cd util-linux-2.25
./configure
make nsenter
sudo cp nsenter /usr/local/bin

# Confirm that nsenter in installed
nsenter --version

cd /home/travis/
