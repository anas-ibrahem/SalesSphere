
# Sales Sphere

Sales Sphere is a comprehensive web and mobile application designed for small-to-medium-sized businesses focused on sales operations. The platform provides tailored features for different types of users to manage and optimize their sales processes.

[https://sales-sphere.amrsamy.tech/](https://sales-sphere.amrsamy.tech/)

---

## Overview

### Key Features
- **Business Manager Features**:
  - Register a business and await admin verification.
  - View business statistics, revenue, customer insights, top employees, and more with customizable graphs and filters.
  - Manage employees, assign targets, and track their progress.
  - Access detailed activity logs, deal summaries, and customer data.
  - Edit business and employee profiles.

- **Deal Opener Features**:
  - Add new customers to the business.
  - Open and manage deals with assigned customers.

- **Deal Executor Features**:
  - Claim deals opened by deal openers.
  - Add financial records (expenses/revenue) to claimed deals.
  - Close deals and mark them as won or lost.
  - View financial records for their deals.

- **Role-Based Views**:
  - Different user roles have distinct views and permissions on the website.
  - Example: Business managers see comprehensive business stats, while employees see personal stats and rankings.

- **Gamification with Badges**:
  - Employees can earn badges for achievements such as opening deals, closing deals as won, achieving revenue targets, and more.

- **Notification System**:
  - Notifications are prioritized and track seen/unseen status.

- **Admin Panel**:
  - Manage business registration requests.
  - Suspend or unblock business accounts.

---

## Mobile App

The mobile app is an extension of the website, designed for employees to manage their tasks on the go. It is exclusively for:
- **Deal Openers**: Work on deals and customer tasks.
- **Deal Executors**: Manage and update financial records and close deals.

---

## Tech Stack

### Website
- **Frontend**: React, MUI, Tailwind CSS
- **Graphing**: Advanced graphing libraries for visualizing business data.
- **Backend**: Express.js, JWT Authentication, PostgreSQL database.

### Mobile App
- **Platform**: Android
- **Language**: Kotlin

---

## Team
- **Mobile**: [Saleh](https://github.com/salehahmed99)
- **Website Frontend**: [Amr Samy](https://github.com/AmrSamy59), [Anas Ibrahem](https://github.com/anas-ibrahem), [Abdallah Ayman](https://github.com/AbdallahAyman03)
- **Backend**: [Amr Samy](https://github.com/AmrSamy59), [Anas Ibrahem](https://github.com/anas-ibrahem), [Abdallah Ayman](https://github.com/AbdallahAyman03), [Saleh](https://github.com/salehahmed99)

---

## Deployed Preview
Check out the live application here: [Sales Sphere](https://sales-sphere.amrsamy.tech/), [Admin Panel](https://sales-sphere.amrsamy.tech/admin)

---
## Test Accounts

| Role               | email/username          | Password           |
|--------------------|-------------------------|--------------------|
| Business Manager   | salesbm@gmail.com       | StrongPassword#123 |
| Deal Opener        | salesopener@gmail.com   | StrongPassword#123 |
| Deal Executor      | salescloser@gmail.com   | StrongPassword#123 |
| Admin (Master)     | admin                   | amr123             |
| Admin (Normal)     | admin2                  | amr123             |
---

## Development Focus
- **Database-Centric Design**: PostgreSQL serves as the backbone, handling the complex data operations required by the application.
- **Collaborative Backend Development**: All team members contributed to building and optimizing the backend.
- **User-Friendly UI**: The frontend team focused on creating an intuitive and visually appealing interface.

---
## Screenshots

### Overview Section
<div style="display: flex; justify-content: space-around; align-items: center;">

  <figure style="text-align: center;">
    <h5>Executor Overview</h5>
    <img src="https://github.com/AmrSamy59/SalesSphere/blob/main/readme-assets/exec_overview.png" alt="Image 1" height="400px" width="812px">
  </figure>

  <figure style="text-align: center;">
    <h5>BM Overview</h5>
    <img src="https://github.com/AmrSamy59/SalesSphere/blob/main/readme-assets/bm_overview.png" alt="Image 2" height="400px" width="812px">
  </figure>

  <figure style="text-align: center;">
    <img src="https://github.com/AmrSamy59/SalesSphere/blob/main/readme-assets/bm_overview2.png" alt="Image 3"  height="400px" width="812px">
  </figure>
  <figure style="text-align: center;">
    <img src="https://github.com/AmrSamy59/SalesSphere/blob/main/readme-assets/bm_overview3.png" alt="Image 4"  height="400px" width="812px">
  </figure>

</div>

### Deals Section
<div style="display: flex; justify-content: space-around; align-items: center;">

  <figure style="text-align: center;">
    <h5>Deals List</h5>
    <img src="https://github.com/AmrSamy59/SalesSphere/blob/main/readme-assets/deals.png" alt="Image 1" height="400px" width="812px">
  </figure>

  <figure style="text-align: center;">
    <h5>Deal Example</h5>
    <img src="https://github.com/AmrSamy59/SalesSphere/blob/main/readme-assets/deal.png" alt="Image 2" height="400px" width="812px">
  </figure>
</div>

### Other Sections
<div style="display: flex; justify-content: space-around; align-items: center;">
  <figure style="text-align: center;">
    <h5>Business Logs (BM only)</h5>
    <img src="https://github.com/AmrSamy59/SalesSphere/blob/main/readme-assets/logs.png" alt="Image 1" height="400px" width="812px">
  </figure>
  <figure style="text-align: center;">
    <h5>Financial Records (BM/Executor only)</h5>
    <img src="https://github.com/AmrSamy59/SalesSphere/blob/main/readme-assets/fr.png" alt="Image 2" height="400px" width="812px">
  </figure>

  <figure style="text-align: center;">
    <h5>Notifications</h5>
    <img src="https://github.com/AmrSamy59/SalesSphere/blob/main/readme-assets/notifications.png" alt="Image 3" height="400px" width="812px">
  </figure>
  <figure style="text-align: center;">
    <h5>Profile</h5>
    <img src="https://github.com/AmrSamy59/SalesSphere/blob/main/readme-assets/profile.png" alt="Image 4" height="400px" width="812px">
  </figure>

  <figure style="text-align: center;">
    <h5>Targets</h5>
    <img src="https://github.com/AmrSamy59/SalesSphere/blob/main/readme-assets/targets.png" alt="Image 5" height="400px" width="812px">
  </figure>
</div>

### Admin Panel
<div style="display: flex; justify-content: space-around; align-items: center;">

  <figure style="text-align: center;">
    <h5>Business Requests</h5>
    <img src="https://github.com/AmrSamy59/SalesSphere/blob/main/readme-assets/admin_panel.png" alt="Image 1" height="400px" width="812px">
  </figure>

  <figure style="text-align: center;">
    <h5>Manage Other Admins (Master Admin Only)</h5>
    <img src="https://github.com/AmrSamy59/SalesSphere/blob/main/readme-assets/admin_panel2.png" alt="Image 2" height="400px" width="812px">
  </figure>
</div>

### Mobile App
#### Login Panel & Deal Opener Overview
<div align="center">
  <img src="https://github.com/AmrSamy59/SalesSphere/blob/main/readme-assets/mlogin.jpg" height = "500"  alt="mobile-image" />
  <img src="https://github.com/AmrSamy59/SalesSphere/blob/main/readme-assets/moverview2.jpg" height = "500"  alt="mobile-image" />
  <img src="https://github.com/AmrSamy59/SalesSphere/blob/main/readme-assets/moverview2.jpg" height = "500"  alt="mobile-image" />
</div>

#### Deals & Customers
<div align="center">
  <img src="https://github.com/AmrSamy59/SalesSphere/blob/main/readme-assets/mdeals.jpg" height = "500"  alt="mobile-image" />
  <img src="https://github.com/AmrSamy59/SalesSphere/blob/main/readme-assets/mdeal.jpg" height = "500"  alt="mobile-image" />
  <img src="https://github.com/AmrSamy59/SalesSphere/blob/main/readme-assets/mcustomers.jpg" height = "500"  alt="mobile-image" />
</div>

#### Notifications & Badges
<div align="center">
  <img src="https://github.com/AmrSamy59/SalesSphere/blob/main/readme-assets/mnotifications.jpg" height = "500"  alt="mobile-image" />
  <img src="https://github.com/AmrSamy59/SalesSphere/blob/main/readme-assets/mbadges.jpg" height = "500"  alt="mobile-image" />
</div>

---


Enjoy exploring **Sales Sphere**!
