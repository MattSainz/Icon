# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure(2) do |config|

  config.vm.box = "ubuntu/trusty64"


  config.vm.provision 'chef_client' do |chef|
    chef.chef_server_url = 'https://api.chef.io/organizations/sainzchef'
    chef.validation_key_path = 'validation.pem'
    chef.validation_client_name = 'icon_dev'
    chef.add_role "icon_dev"
    chef.node_name = "icon_dev"
  end

  config.vm.provider "virtualbox" do |v|
      v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/vagrant", "1"]
    v.memory = 4096
    v.cpus = 2
  end

end
