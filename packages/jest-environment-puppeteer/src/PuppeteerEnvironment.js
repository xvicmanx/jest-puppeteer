import fs from 'fs'
import NodeEnvironment from 'jest-environment-node'
import puppeteer from 'puppeteer'
import { WS_ENDPOINT_PATH } from './constants'

const handleError = error => {
  process.emit('uncaughtException', error)
}

class PuppeteerEnvironment extends NodeEnvironment {
  async setup() {
    const wsEndpoint = fs.readFileSync(WS_ENDPOINT_PATH, 'utf8')
    if (!wsEndpoint) {
      throw new Error('wsEndpoint not found')
    }
    this.global.browser = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
    })
    this.global.mainPage = await this.global.browser.newPage()
    this.global.mainPage.addListener('pageerror', handleError)
  }

  async teardown() {
    this.global.mainPage.removeListener('pageerror', handleError)
    await this.global.mainPage.close()
  }
}

export default PuppeteerEnvironment
