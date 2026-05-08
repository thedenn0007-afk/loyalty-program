# Demo Guide

This guide is for presenters, operators, and reviewers who want to run the loyalty demo smoothly from A to Z.

## Start The App
```bash
npm install
npm run dev
```

Open:
- Customer landing: `http://localhost:3000/`
- Admin console: `http://localhost:3000/admin`

## Brand Switching
- Use the top pill navigation to move between `Matsuri`, `Roast Theory`, and `Noir Social`.
- Each brand runs on the same engine but has distinct missions, copy, and visual identity.

## Role Switching
- Use `Switch to Admin` from any customer route.
- Use `Switch to Customer` from any admin route.
- This keeps the presenter moving through the real operating handoff without bypass buttons in the customer experience.

## Recommended A-to-Z Demo Script
### Script 1: Proof approval to coupon
1. Open `Matsuri`
2. Select `Mika Shah`
3. Go to `Missions` or `Home`
4. Show the mission in `pending review`
5. Switch to `Admin`
6. Open `Verification`
7. Approve Mika’s submission
8. Switch back to `Customer`
9. Go to `Rewards`
10. Claim the reward
11. Show the generated coupon

### Script 2: Admin-led billing to progression
1. Open `Admin > Customers`
2. Use phone lookup or open `Kian Malhotra`
3. Add a purchase using the customer’s phone number
4. Go to `Verification`
5. Validate the bill
6. Return to customer view for Kian
7. Show updated points, stars, and mission state

### Script 3: Live coupon redemption
1. Open `Noir Social`
2. Select `Zev Arora`
3. Go to `Rewards`
4. Show the active coupon
5. Switch to `Admin > Verification`
6. Redeem the coupon
7. Return to customer view and show the updated redeemed state

## Seeded Personas
- `Aanya Kapoor` (`Matsuri`)
  - new member
  - good for onboarding and early mission explanation
- `Mika Shah` (`Matsuri`)
  - pending proof review
  - best for approval flow demo
- `Kian Malhotra` (`Roast Theory`)
  - pending billing validation
  - best for admin-led purchase entry demo
- `Zev Arora` (`Noir Social`)
  - active coupon
  - best for redemption flow demo

## Admin Control Cheat Sheet
### Customers
- create a new customer by name, phone, and birthday
- open an existing customer by phone
- add purchase details
- attach optional bill upload path

### Verification
- approve proof submissions
- reject proof submissions
- validate pending billing records
- redeem active coupons

### Campaigns
- advance campaigns through lifecycle states for presentation

## Demo Safety Notes
- Customer UI does not contain force-complete or self-redeem shortcuts.
- Admin controls are the only place where approvals, billing validation, and redemptions occur.
- Use `Reset Demo` in the top bar if you want to return to seed data quickly.
