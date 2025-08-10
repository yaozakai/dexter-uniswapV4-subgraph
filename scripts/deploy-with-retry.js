#!/usr/bin/env node

/**
 * Deploy script with retry logic for handling blockchain reorgs
 * Usage: node scripts/deploy-with-retry.js [network]
 */

const { execSync } = require('child_process')

const network = process.argv[2] || 'mainnet'
const maxRetries = 3
const retryDelay = 30000 // 30 seconds

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function deployWithRetry() {
  console.log(`🚀 Starting deployment for network: ${network}`)

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📦 Attempt ${attempt}/${maxRetries}: Generating subgraph configuration...`)
      execSync(`node scripts/generate-subgraph.js ${network}`, { stdio: 'inherit' })

      console.log(`🔨 Generating types...`)
      execSync(`npm run codegen`, { stdio: 'inherit' })

      console.log(`🏗️  Building subgraph...`)
      execSync(`graph build --network ${network}`, { stdio: 'inherit' })

      console.log(`🚀 Deploying to The Graph...`)
      if (network === 'mainnet') {
        execSync(
          `source .env && graph deploy uniswap-v-4 --node https://api.studio.thegraph.com/deploy/ --access-token $THEGRAPH_DEPLOY_KEY --network mainnet`,
          { stdio: 'inherit', shell: true },
        )
      } else if (network === 'sepolia') {
        execSync(
          `source .env && graph deploy uniswap-v-4 --node https://api.studio.thegraph.com/deploy/ --access-token $THEGRAPH_DEPLOY_KEY --network sepolia`,
          { stdio: 'inherit', shell: true },
        )
      } else {
        console.error(`❌ Unsupported network: ${network}`)
        process.exit(1)
      }

      console.log(`✅ Deployment successful for ${network}!`)
      return
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message)

      if (attempt < maxRetries) {
        console.log(`⏳ Waiting ${retryDelay / 1000} seconds before retry...`)
        await sleep(retryDelay)
      } else {
        console.error(`❌ All ${maxRetries} deployment attempts failed.`)

        // Log additional debugging information
        console.log('\n🔍 Troubleshooting tips:')
        console.log('1. Check if there are any ongoing blockchain reorgs')
        console.log('2. Verify your RPC endpoint is stable')
        console.log('3. Try deploying to a different network first')
        console.log('4. Check The Graph Discord for any known issues')

        process.exit(1)
      }
    }
  }
}

deployWithRetry().catch(console.error)
