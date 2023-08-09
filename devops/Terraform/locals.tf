locals {
  project         = lower(var.project)
  stage_code      = lower(terraform.workspace)
  resource_prefix = "${local.project}-${local.stage_code}"
  default_tags = {
    stage      = local.stage_code
    managed-by = "terraform"
  }
}
