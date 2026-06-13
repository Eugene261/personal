# Eugene's GitHub Profile README

This template is designed to decorate your GitHub Profile page using the dynamic components built into your portfolio.

## 🚀 How to Setup
1. Create a public GitHub repository named exactly after your GitHub username (e.g., if your username is `Eugene261`, create the repo `Eugene261`).
2. Create a file in that repository called `README.md` and copy the content inside **Part 1** below.
3. Replace `your-portfolio-domain.com` with your live Vercel portfolio URL in the image link and the blog feed link.
4. To enable auto-updating blogs, create a file in your profile repository at `.github/workflows/update-readme.yml` and copy the content from **Part 2** below.

---

## Part 1: README.md Content
```markdown
<p align="center">
  <img src="https://your-portfolio-domain.com/api/github/banner" width="850" alt="Eugene Opoku Profile Banner" />
</p>

### CEO, Founder & Full-Stack Engineer based in Accra, Ghana 🇬🇭

> *"Those who achieve great things do not depend on calm seas — they learn to steer even in the storm."*

---

### 💼 Stealth & Commercial Development
> [!NOTE]
> **Why is my contribution graph quiet?**  
> I write a lot of code every single day, but most of my work happens inside **private repositories** and secure organizations building proprietary commercial software, AI integrations, and stealth startups.

Below is a showcase of what I design, build, and maintain.

---

## 🚀 Active Startups

### 🛍️ [For You Commerce](https://getforyu.com)
*Founder, CEO & Full-Stack Engineer (2025 — Present)*  
A social commerce platform designed to make commerce in the era of social feeds trustworthy, scam-free, and seamless.
*   **Built with:** React, Next.js, Node.js, PostgreSQL, TailwindCSS

### 🌍 [SaaS Afric](https://saasafric.com)
*Founder & Builder (2025 — Present)*  
Building infrastructure tools and platforms to help African SaaS founders and developers scale their products internationally.
*   **Built with:** React, Next.js, TypeScript, Node.js

---

## 🛠️ Featured Products Shipped

*   🤖 **[Audience](https://audiance.it)**: An AI-powered participation assistant designed to help builders show up confidently on X (Twitter)—acting as a smart counselor rather than a ghostwriter. *(Chrome Extension · React · Node.js)*
*   📖 **[Nwoma](https://nwoma.app)**: An academic productivity suite supporting research paper indexing, formatting, slide compilation, synthesized voice coaching, and synchronized teleprompting. *(Next.js · ElevenLabs · TypeScript)*
*   💳 **[Betify (MyHuzl)](https://myhuzl.vercel.app)**: A web and mobile expert marketplace with secure built-in escrow, video/audio calls (Agora.io), real-time chats (Socket.IO), and full integration with Mobile Money. *(React Native · NestJS · PostgreSQL)*
*   🇬🇭 **[Stop the NITA Bill](https://nitastopthebill.vercel.app)**: A privacy-first petition platform for Ghanaian tech professionals to oppose restrictive government software licensing and registration requirements. *(Next.js · React · Vercel)*

---

## ✍️ Latest Articles from My Blog
<!-- START_SECTION:blogs -->
*No articles loaded yet. The GitHub Action will populate this dynamically.*
<!-- END_SECTION:blogs -->

---

## 💻 Tech Stack & Tooling

### Frontend & Mobile
<p align="left">
  <img src="https://img.shields.io/badge/typescript-%23007acc.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
  <img src="https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</p>

### Backend & Databases
<p align="left">
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-39827F?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase" />
</p>

### AI & Data Science
<p align="left">
  <img src="https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54" alt="Python" />
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI API" />
  <img src="https://img.shields.io/badge/ElevenLabs-orange?style=for-the-badge" alt="ElevenLabs" />
</p>

### DevOps & Infrastructure
<p align="left">
  <img src="https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS" />
  <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white" alt="Git" />
</p>

---

## 📬 Connect With Me
*   🐦 **Twitter/X**: [@YGene_](https://x.com/YGene_)
*   💼 **LinkedIn**: [Eugene Opoku](https://www.linkedin.com/in/eugene-opoku-243601392)
*   📧 **Direct**: `eugeneopoku74@gmail.com`
```

---

## Part 2: GitHub Action Workflow
Create a file at `.github/workflows/update-readme.yml` in your profile repository:
```yaml
name: Update Latest Blog Posts
on:
  schedule:
    # Runs every 12 hours
    - cron: '0 */12 * * *'
  workflow_dispatch: # Allows manual trigger

jobs:
  update-readme-with-blog:
    name: Update this README with latest blog posts
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Pull in RSS posts
        uses: gautamkrishnar/blog-post-workflow@v1
        with:
          feed_list: "https://your-portfolio-domain.com/rss"
```
