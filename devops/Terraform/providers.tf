# Configure provider features here
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.16"
    }
  }
}

provider "azurerm" {
  subscription_id = "5c41ba40-6ca2-4e8a-9646-d3585df38b5a"

  features {
    resource_group {
      prevent_deletion_if_contains_resources = true
    }
  }
}
