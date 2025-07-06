#!/usr/bin/env node

const fs = require('fs')
const mustache = require('mustache')

// Get network from command line argument
const network = process.argv[2]
if (!network) {
  console.error('Usage: node generate-subgraph.js <network>')
  process.exit(1)
}

// Read networks.json
const networksData = JSON.parse(fs.readFileSync('networks.json', 'utf8'))

// Get network-specific config
const networkConfig = networksData[network]
if (!networkConfig) {
  console.error(`Network "${network}" not found in networks.json`)
  process.exit(1)
}

// Read template
const template = fs.readFileSync('subgraph.template.yaml', 'utf8')

// Generate subgraph.yaml
const output = mustache.render(template, networkConfig)

// Write output
fs.writeFileSync('subgraph.yaml', output)

console.log(`Generated subgraph.yaml for network: ${network}`)
