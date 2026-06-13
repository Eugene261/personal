import { getBlogPosts } from "@/app/blog/utils";
import { getDocument } from "@/lib/firebaseData";
import aboutDataLocal from "@/data/about.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function escapeXml(unsafe: string) {
  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

export async function GET() {
  let posts: any[] = [];
  try {
    const allPosts = await getBlogPosts();
    posts = allPosts.sort((a, b) =>
      new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt) ? -1 : 1
    );
  } catch (error) {
    console.error("Failed to load blog posts for github banner API:", error);
  }

  let aboutData: any = null;
  try {
    aboutData = await getDocument<any>("content", "about");
  } catch (error) {
    console.error("Failed to load about data for github banner API:", error);
  }
  const safeAbout = aboutData || aboutDataLocal || {};

  // Construct blog markup for the SVG
  let blogItemsMarkup = "";
  if (posts && posts.length > 0) {
    blogItemsMarkup = posts.slice(0, 3).map((post, index) => {
      const title = escapeXml(truncateText(post.metadata.title, 42));
      const date = new Date(post.metadata.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
      const yPos = 35 + index * 52;
      return `
      <g transform="translate(0, ${yPos})">
        <circle cx="6" cy="-4" r="3" fill="#818CF8" />
        <text x="20" y="0" fill="#F4F4F5" font-size="13" font-weight="500">${title}</text>
        <text x="20" y="16" fill="#71717A" font-size="11" font-weight="400">${date}</text>
      </g>`;
    }).join("\n");
  } else {
    blogItemsMarkup = `
      <g transform="translate(0, 50)">
        <text x="20" y="0" fill="#71717A" font-size="13" font-style="italic">No articles published yet.</text>
      </g>`;
  }

  // Construct top primary skills
  const primarySkills = safeAbout.skills?.primary || ["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS", "PostgreSQL"];
  
  // Construct dynamic layout for skills
  const skillPositions = [
    { x: 0, y: 0, w: 65 },
    { x: 73, y: 0, w: 85 },
    { x: 166, y: 0, w: 95 },
    { x: 0, y: 32, w: 80 },
    { x: 88, y: 32, w: 65 },
    { x: 161, y: 32, w: 80 }
  ];

  let skillsMarkup = "";
  primarySkills.slice(0, 6).forEach((skill: string, index: number) => {
    const pos = skillPositions[index] || { x: 0, y: 0, w: 70 };
    const label = escapeXml(skill);
    skillsMarkup += `
          <g transform="translate(${pos.x}, ${pos.y})">
            <rect x="0" y="0" width="${pos.w}" height="24" rx="6" fill="#18181B" stroke="#27272A" stroke-width="1"/>
            <text x="${pos.w / 2}" y="15" fill="#E4E4E7" font-size="10" font-weight="500" text-anchor="middle">${label}</text>
          </g>`;
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="850" height="380" viewBox="0 0 850 380" fill="none">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&amp;family=Outfit:wght@400;500;600;700&amp;family=Playfair+Display:ital,wght@0,500;1,500&amp;display=swap');
    .card {
      font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .text-title {
      font-family: 'Playfair Display', Georgia, serif;
    }
    .text-mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    .pulse {
      animation: pulse-animation 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse-animation {
      0%, 100% { opacity: 1; }
      50% { opacity: .4; }
    }
  </style>

  <!-- Background with dark sleek gradient and border -->
  <rect width="850" height="380" rx="16" fill="#0A0A0B" stroke="#1F1F23" stroke-width="1.5"/>
  <rect x="1" y="1" width="848" height="378" rx="15" fill="url(#bg-gradient)" opacity="0.95"/>
  
  <defs>
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E0E11" />
      <stop offset="100%" stop-color="#050507" />
    </linearGradient>
    <linearGradient id="primary-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#A5B4FC" />
      <stop offset="50%" stop-color="#818CF8" />
      <stop offset="100%" stop-color="#6366F1" />
    </linearGradient>
    <filter id="glow-effect" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Decorative Grid (Subtle) -->
  <g stroke="#161619" stroke-width="1" opacity="0.4">
    <path d="M 0,50 L 850,50 M 0,100 L 850,100 M 0,150 L 850,150 M 0,200 L 850,200 M 0,250 L 850,250 M 0,300 L 850,300 M 0,350 L 850,350" />
    <path d="M 50,0 L 50,380 M 100,0 L 100,380 M 150,0 L 150,380 M 200,0 L 200,380 M 250,0 L 250,380 M 300,0 L 300,380 M 350,0 L 350,380 M 400,0 L 400,380 M 450,0 L 450,380 M 500,0 L 500,380 M 550,0 L 550,380 M 600,0 L 600,380 M 650,0 L 650,380 M 700,0 L 700,380 M 750,0 L 750,380 M 800,0 L 800,380" />
  </g>
  
  <!-- Glowing gradient blobs behind -->
  <circle cx="750" cy="80" r="100" fill="#6366F1" opacity="0.05" filter="url(#glow-effect)" />
  <circle cx="80" cy="300" r="120" fill="#38BDF8" opacity="0.03" filter="url(#glow-effect)" />

  <g class="card">
    <!-- Left Panel: Profile Info -->
    <g transform="translate(45, 45)">
      <!-- Status Badge -->
      <g transform="translate(0, 0)">
        <rect width="115" height="22" rx="11" fill="#18181B" stroke="#27272A" stroke-width="1"/>
        <circle cx="12" cy="11" r="4" fill="#10B981" class="pulse"/>
        <text x="24" y="15" fill="#A1A1AA" font-size="10" font-weight="600" letter-spacing="0.5" class="text-mono">ACTIVE NOW</text>
      </g>

      <!-- Name & Title -->
      <text x="0" y="60" fill="url(#primary-grad)" font-size="36" font-weight="700" letter-spacing="-0.5" class="text-title">Eugene Opoku</text>
      <text x="0" y="85" fill="#E4E4E7" font-size="15" font-weight="500" letter-spacing="-0.2">Founder &amp; Full-Stack Engineer</text>
      <text x="0" y="105" fill="#71717A" font-size="12" font-weight="400">Accra, Ghana 🇬🇭</text>

      <!-- Short Bio / Focus -->
      <g transform="translate(0, 135)">
        <text x="0" y="15" fill="#A1A1AA" font-size="12" font-weight="600" letter-spacing="1" class="text-mono">CURRENT FOCUS</text>
        <!-- Startup 1 -->
        <g transform="translate(0, 32)">
          <text x="0" y="0" fill="#F4F4F5" font-size="13" font-weight="600">For You Commerce</text>
          <text x="0" y="16" fill="#71717A" font-size="11" font-weight="400">Social commerce infrastructure</text>
        </g>
        <!-- Startup 2 -->
        <g transform="translate(0, 75)">
          <text x="0" y="0" fill="#F4F4F5" font-size="13" font-weight="600">SaaS Afric</text>
          <text x="0" y="16" fill="#71717A" font-size="11" font-weight="400">Scaling African tech globally</text>
        </g>
      </g>
    </g>

    <!-- Divider Line -->
    <line x1="440" y1="40" x2="440" y2="300" stroke="#1F1F23" stroke-width="1.5" stroke-dasharray="4 4"/>

    <!-- Right Panel: Dynamic Content (Latest Writing) -->
    <g transform="translate(480, 45)">
      <text x="0" y="15" fill="#A1A1AA" font-size="12" font-weight="600" letter-spacing="1" class="text-mono">LATEST WRITING</text>
      
      <!-- Dynamic Blog items -->
      ${blogItemsMarkup}
      
      <!-- Tech Stack Badges at bottom right -->
      <g transform="translate(0, 205)">
        <text x="0" y="15" fill="#A1A1AA" font-size="11" font-weight="600" letter-spacing="1" class="text-mono">CORE TOOLKIT</text>
        
        <!-- Tech Stack row -->
        <g transform="translate(0, 28)">
          ${skillsMarkup}
        </g>
      </g>
    </g>

    <!-- Footer Bar -->
    <g transform="translate(45, 335)">
      <line x1="0" y1="0" x2="760" y2="0" stroke="#1F1F23" stroke-width="1"/>
      <text x="0" y="20" fill="#52525B" font-size="11" font-weight="400">Dynamically generated from profile systems</text>
      
      <!-- Portfolio link -->
      <text x="760" y="20" fill="#818CF8" font-size="11" font-weight="600" text-anchor="end">eugeneopoku.com</text>
    </g>
  </g>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
    },
  });
}
