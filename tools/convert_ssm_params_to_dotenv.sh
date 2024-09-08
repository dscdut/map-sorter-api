#!/bin/bash
set -ex

# *** This script is used to convert the results get from SSM parameters from one AWS profile (or account) into .env file ***

# *** First, you need to get the list of SSM parameters from the source AWS profile (or account) and save it to a json file ***
# *** Run this command: aws ssm get-parameters-by-path --path "/<path_to_params>" --with-decryption --recursive > <name_of_the_profile>.json ***

# *** Then you run this script to convert the SSM parameters to the .env file ***

# Check if the input JSON file is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <input_json_file>"
  exit 1
fi

json_file=$1

# Output file for environment variables
env_file=".env"

# Empty the existing env file (optional)
> "$env_file"

# Loop through each parameter in the JSON file and convert to .env format
jq -r '.Parameters[] | .Name = (.Name | gsub("^/[^/]+/"; "") | gsub("/"; "_")) | if .Value == "" then "Empty value for key: " + .Name else .Name + "=" + .Value end' "$json_file" | while read -r line; do
  if [[ $line == Empty* ]]; then
    echo "$line"
  else
    # Remove the project name prefix
    cleaned_line=$(echo "$line" | sed 's/^mapsorter_//')
    echo "$cleaned_line" >> "$env_file"
  fi
done

# Print success message
echo "Successfully exported parameters to '$env_file'"
