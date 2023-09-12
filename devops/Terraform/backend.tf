terraform {
  backend "azurerm" {
    resource_group_name  = "obelisk-infra-rg"
    storage_account_name = "obeliskinfrastorage"
    container_name       = "obelisk-frontend"
    key                  = "obelisk-frontend.tfstate"
  }
}
