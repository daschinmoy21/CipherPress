import { createHelia } from 'helia'
import { strings } from '@helia/strings'
import { unixfs } from '@helia/unixfs'
import { CID } from 'multiformats/cid'
import type { NewsArticle } from '../types/article'

export class IPFSService {
  private helia: any = null
  private fs: any = null
  private str: any = null

  async initialize(): Promise<void> {
    if (this.helia) return

    try {
      // Create Helia with minimal config for browser
      this.helia = await createHelia({
        start: false // Don't start networking immediately
      })

      // Initialize services
      this.fs = unixfs(this.helia)
      this.str = strings(this.helia)

      console.log('IPFS initialized successfully')
    } catch (err) {
      console.error('Failed to initialize IPFS:', err)
      throw new Error('Failed to initialize IPFS')
    }
  }

  async uploadArticle(article: NewsArticle): Promise<string> {
    if (!this.str) {
      await this.initialize()
    }

    try {
      const content = JSON.stringify(article)
      const cid = await this.str.add(content)
      
      // Store in local cache immediately
      localStorage.setItem(`ipfs-article-${cid.toString()}`, content)
      console.log('Article cached locally with CID:', cid.toString())
      
      return cid.toString()
    } catch (err) {
      console.error('Failed to upload to IPFS:', err)
      throw new Error('Failed to upload article')
    }
  }

  async getArticle(cidString: string): Promise<NewsArticle> {
    console.log('Fetching article with CID:', cidString)

    try {
      // First check local cache
      const cached = localStorage.getItem(`ipfs-article-${cidString}`)
      if (cached) {
        console.log('Retrieved article from local cache:', cidString)
        return JSON.parse(cached)
      }

      // Initialize if needed
      if (!this.str) {
        await this.initialize()
      }

      // Try to get from Helia
      const cid = CID.parse(cidString)
      const content = await this.str.get(cid)
      
      if (!content) {
        throw new Error('No content found for CID')
      }

      const article = JSON.parse(content)
      
      // Cache for future use
      localStorage.setItem(`ipfs-article-${cidString}`, JSON.stringify(article))
      console.log('Article cached from IPFS:', cidString)
      
      return article
    } catch (err) {
      console.error(`Failed to get article ${cidString}:`, err)
      throw new Error(`Failed to retrieve article ${cidString}`)
    }
  }

  async getAllArticles(cids: string[]): Promise<NewsArticle[]> {
    console.log('Fetching articles for CIDs:', cids)
    const articles: NewsArticle[] = []
    
    for (const cid of cids) {
      try {
        const article = await this.getArticle(cid)
        articles.push(article)
      } catch (err) {
        console.error(`Failed to get article ${cid}:`, err)
        // Continue with other articles even if one fails
      }
    }
    
    return articles
  }

  async cleanup(): Promise<void> {
    if (this.helia) {
      await this.helia.stop()
      this.helia = null
      this.fs = null
      this.str = null
    }
  }
}

export const ipfsService = new IPFSService() 