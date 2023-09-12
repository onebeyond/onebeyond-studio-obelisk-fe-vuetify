variable "project" {
  type        = string
  description = "Project code which is used for naming the stage resources. For example, \"dcslgs-wt\"."
  validation {
    condition     = length(var.project) > 0
    error_message = "Project code should be a non-empty string like \"dcslgs-wt\"."
  }
}

variable "resource_location" {
  type        = string
  description = "Moniker of location which is used for placing the stage resources in. For exaple, \"uksouth\", \"canadacentral\"."
  validation {
    condition     = length(var.resource_location) > 0 # Ideally should be checked against a list of possible locations via data source
    error_message = "Stage location moniker should be a non-empty string like \"uksouth\", \"canadacentral\"."
  }
}

variable "static_ui_location" {
  type        = string
  description = "Moniker of location which is used for placing static UI in. Only limited number of locations are allowed. Defaults to West Europe."
  default     = "westeurope"
  validation {
    condition     = contains(["westus2", "centralus", "eastus2", "westeurope", "eastasia", "eastasiastage"], var.static_ui_location)
    error_message = "Allowed values for the static UI location are \"westus2\", \"centralus\", \"eastus2\", \"westeurope\", \"eastasia\", \"eastasiastage\"."
  }
}

variable "static_ui_sku_size" {
  type        = string
  description = "SKU for static UI."
  validation {
    condition     = contains(["Free", "Standard"], var.static_ui_sku_size)
    error_message = "Allowed values for the static UI sku size are \"Free\", \"Standard\"."
  }
}

variable "static_ui_custom_domain" {
  type        = string
  description = "Custom domain name for static UI."
  nullable    = true
  default     = null
}
