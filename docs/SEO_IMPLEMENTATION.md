# SEO Implementation Guide

## Overview

This document outlines the comprehensive SEO implementation for the ATLD E-Learning platform. The implementation includes metadata management, structured data, sitemaps, and other SEO best practices.

## Features Implemented

### 1. SEO Configuration (`src/configs/seo.config.ts`)

- **Base SEO Configuration**: Centralized configuration for site-wide SEO settings
- **Metadata Generation**: Helper function to generate consistent metadata across pages
- **Page-specific Configurations**: Pre-defined SEO settings for different page types
- **Structured Data Generation**: Functions to generate JSON-LD structured data for courses and organization

### 2. SEO Components (`src/components/SEO/`)

- **StructuredData**: Component for rendering JSON-LD structured data
- **PageSEO**: Comprehensive SEO component for client-side pages (if needed)

### 3. Page Metadata

All pages now include proper metadata:

#### Static Pages

- **Landing Page**: Optimized for homepage with relevant keywords
- **Sign In/Sign Up**: Authentication pages with appropriate metadata
- **Course List Pages**: ATLD and Hoc Nghe course listing pages
- **Learning/Verification Pages**: Private pages with noindex for security

#### Dynamic Pages

- **Course Preview Pages**: Dynamic metadata based on course data
- **Structured Data**: Course information in JSON-LD format

### 4. Technical SEO

- **Sitemap**: Auto-generated sitemap at `/sitemap.xml`
- **Robots.txt**: Proper crawling directives at `/robots.txt`
- **Manifest**: PWA manifest for mobile optimization
- **Canonical URLs**: Proper canonical link implementation
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Twitter sharing optimization

## SEO Configuration Details

### Base Configuration

```typescript
export const baseSeoConfig = {
    siteName: "ATLD E-Learning",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://antoanlaodongso.com",
    defaultTitle: "Hệ thống đào tạo An Toàn Lao Động",
    defaultDescription: "Hệ thống đào tạo trực tuyến chuyên nghiệp về An Toàn Lao Động...",
    defaultKeywords: ["an toàn lao động", "đào tạo an toàn", ...],
    // ... more configuration
};
```

### Metadata Generation

The `generateMetadata` function creates comprehensive metadata including:

- Title and description
- Keywords
- Open Graph tags
- Twitter Card tags
- Canonical URLs
- Robot directives
- Verification tags

### Structured Data

#### Course Structured Data

```typescript
{
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Course Title",
    "description": "Course Description",
    "provider": {
        "@type": "Organization",
        "name": "ATLD E-Learning"
    },
    // ... more course details
}
```

#### Organization Structured Data

```typescript
{
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "ATLD E-Learning",
    "url": "https://antoanlaodongso.com",
    // ... more organization details
}
```

## Page-Specific SEO

### Landing Page

- **Title**: "Trang chủ | Hệ thống đào tạo An Toàn Lao Động"
- **Description**: Focus on platform introduction and benefits
- **Keywords**: Homepage, introduction, safety training

### Course Pages

- **Title**: Dynamic based on course title
- **Description**: Course-specific description or generated from title
- **Keywords**: Course-specific keywords plus general safety training terms
- **Structured Data**: Course schema with detailed information

### Authentication Pages

- **Sign In**: Focused on login functionality
- **Sign Up**: Emphasizing registration benefits
- **Keywords**: Authentication-related terms

### Learning/Verification Pages

- **No Index**: These pages are marked as noindex for privacy
- **Internal Use**: Optimized for user experience rather than search engines

## Environment Variables

Add these environment variables to your `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://antoanlaodongso.com
GOOGLE_SITE_VERIFICATION=your-google-verification-code
YANDEX_VERIFICATION=your-yandex-verification-code
YAHOO_VERIFICATION=your-yahoo-verification-code
```

## SEO Best Practices Implemented

### 1. Technical SEO

- ✅ Proper HTML structure with semantic elements
- ✅ Meta tags optimization
- ✅ Canonical URLs
- ✅ Sitemap generation
- ✅ Robots.txt configuration
- ✅ Mobile-friendly design
- ✅ Fast loading times

### 2. Content SEO

- ✅ Unique titles and descriptions for each page
- ✅ Relevant keywords integration
- ✅ Vietnamese language optimization
- ✅ Educational content focus

### 3. Structured Data

- ✅ Course schema markup
- ✅ Organization schema markup
- ✅ Educational content markup
- ✅ JSON-LD format

### 4. Social Media

- ✅ Open Graph tags
- ✅ Twitter Card optimization
- ✅ Social sharing images

## Monitoring and Analytics

### Google Search Console

1. Verify your domain
2. Submit sitemap: `https://antoanlaodongso.com/sitemap.xml`
3. Monitor indexing status
4. Check for crawl errors

### Analytics Integration

- Vercel Analytics is already integrated
- Consider adding Google Analytics for detailed SEO metrics

## Future Enhancements

### 1. Advanced SEO Features

- [ ] Breadcrumb navigation with structured data
- [ ] FAQ schema for course pages
- [ ] Review/Rating schema integration
- [ ] Video schema for course videos

### 2. Performance Optimization

- [ ] Image optimization with next/image
- [ ] Lazy loading implementation
- [ ] Core Web Vitals optimization

### 3. Content SEO

- [ ] Blog section for content marketing
- [ ] Course category pages
- [ ] Instructor profile pages
- [ ] FAQ pages

## Maintenance

### Regular Tasks

1. **Monitor Search Console**: Check for indexing issues
2. **Update Sitemap**: Ensure new courses are included
3. **Review Analytics**: Track SEO performance
4. **Content Updates**: Keep course descriptions fresh

### Code Maintenance

1. **Update Keywords**: Review and update keyword lists
2. **Test Structured Data**: Use Google's Rich Results Test
3. **Performance Monitoring**: Regular Core Web Vitals checks

## Testing Tools

### SEO Testing

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

### Structured Data Testing

- [Schema.org Validator](https://validator.schema.org/)
- [Google Structured Data Testing Tool](https://developers.google.com/search/docs/appearance/structured-data)

## Conclusion

This SEO implementation provides a solid foundation for search engine optimization. The modular approach allows for easy maintenance and future enhancements. Regular monitoring and updates will ensure continued SEO success.
