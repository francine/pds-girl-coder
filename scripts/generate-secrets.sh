#!/bin/bash

# Script to generate secure secrets for production

echo "==================================="
echo "Generating Production Secrets"
echo "==================================="
echo ""

echo "JWT_SECRET:"
openssl rand -base64 32
echo ""

echo "JWT_REFRESH_SECRET:"
openssl rand -base64 32
echo ""

echo "ENCRYPTION_KEY:"
openssl rand -base64 32
echo ""

echo "==================================="
echo "Copy these values to your .env file"
echo "KEEP THESE SECRETS SAFE!"
echo "==================================="
