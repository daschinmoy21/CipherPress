import { ipfsService } from '../src/services/ipfs.js'

async function testIPFS() {
  console.log('Testing IPFS integration...')

  try {
    // Initialize IPFS
    await ipfsService.initialize()
    console.log('✓ IPFS initialized')

    // Test article
    const testArticle = {
      id: 'test-' + Date.now(),
      title: 'Test Article',
      content: 'This is a test article content',
      tags: ['test', 'ipfs'],
      author: '0xTestAddress',
      timestamp: Date.now()
    }

    // Upload test article
    console.log('Uploading test article...')
    const cid = await ipfsService.uploadArticle(testArticle)
    console.log('✓ Article uploaded, CID:', cid)

    // Retrieve article
    console.log('Retrieving article...')
    const retrieved = await ipfsService.getArticle(cid)
    console.log('✓ Article retrieved:', retrieved)

    // Verify content
    if (retrieved.id === testArticle.id) {
      console.log('✓ Content verification passed')
    } else {
      throw new Error('Content verification failed')
    }

    console.log('All tests passed! ✨')
  } catch (err) {
    console.error('Test failed:', err)
    process.exit(1)
  }
}

testIPFS() 