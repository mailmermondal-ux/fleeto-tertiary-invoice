# Architecture Blueprint

## Layers
- App Router UI: dashboard, inventory, billing, invoices, customers, admin configuration.
- Metadata engine: section names, field names/types/order/options/visibility, validation rules, theme tokens.
- Domain services (next implementation): inventoryService, invoiceService, customerService, taxService, pdfService, whatsappService, dealerSettingsService.
- Supabase: PostgreSQL, Auth integration, RLS, Storage.
- Vercel: server rendering/API/server actions; no persistent local filesystem.

## Dynamic configuration rules
- SUPER_ADMIN: full section/field/theme/validation management.
- ADMIN: validation and field configuration subject to permission policy.
- MANAGER/DEALER: consume configuration only.
- Renaming a field changes `display_name`, never `field_key` for system fields.
- New custom fields persist in `custom_data` JSONB until promoted to physical columns.
- Critical accounting fields should not be deletable; they can be relabeled only where compliance permits.

## Billing transaction
Validate authorization → reserve AVAILABLE inventory atomically → server recalculate pricing/tax → allocate invoice number → snapshot dealer/customer/vehicle/financial data → create invoice/items/payment → mark SOLD → audit → generate/store PDF → enqueue WhatsApp job. WhatsApp failure never rolls back invoice.
