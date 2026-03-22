# DilSe Dating

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- User registration and login with profile setup (name, age, gender, bio, interests, photos)
- Profile browsing with match suggestions (based on gender preference)
- Like / pass system to express interest
- Membership subscription starting at 20 INR/month (Basic), with higher tiers (Premium, Gold)
- Stripe payment integration for membership checkout
- Paid members can see who liked them and send messages
- Admin can view all users
- Profile photo upload via blob storage

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: User profiles (name, age, gender, city, bio, interests, photo URL, membership tier)
2. Backend: Like/pass actions, mutual match detection
3. Backend: Membership plans (Basic 20 INR, Premium 99 INR, Gold 299 INR)
4. Backend: Stripe webhook to activate membership on payment
5. Frontend: Landing page (hero, profile suggestions, pricing plans, footer)
6. Frontend: Auth pages (sign up, log in)
7. Frontend: Profile setup wizard after signup
8. Frontend: Browse/Discover page with profile cards (like/pass)
9. Frontend: Matches page
10. Frontend: Subscription/Pricing page with Stripe checkout
11. Frontend: Settings/Edit profile page
