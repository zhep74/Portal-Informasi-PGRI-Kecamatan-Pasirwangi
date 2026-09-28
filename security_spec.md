# Security Specification - PGRI Pasirwangi Portal

## 1. Data Invariants
1. **Public Organization Content**: Collections `settings`, `sejarah`, `pengurus`, `programKerja`, `kegiatan`, `berita`, `prestasi`, `galeri`, `kalender`, and `layanan` represent public organization records. They are publicly readable (`allow read: if true;`) so portal visitors can access official information.
2. **Admin-Only Modification**: Modifying or creating public organization records requires verified Admin identity (`isAdmin()`). Non-admins or unauthenticated users cannot alter organization records.
3. **PII Isolation**: `pendaftaran` (membership applications) and `aspirasi` (feedback messages) contain Personally Identifiable Information (PII) including phone numbers, emails, and NIK/NIP. Public visitors can submit applications (`create`), but `read`, `update`, and `delete` operations are strictly restricted to `isAdmin()` to protect user privacy.
4. **Boundary and Type Validation**: All incoming documents must satisfy strict field type constraints, max length boundaries, and prohibited shadow fields.
5. **ID Integrity**: Document IDs must conform to `isValidId(id)` matching `^[a-zA-Z0-9_\-]+$` and length `<= 128`.

---

## 2. The "Dirty Dozen" Payloads

1. **Payload 1: Unauthenticated Admin Write (Settings)**
   - *Attempt*: An unauthenticated visitor tries to overwrite `/settings/profile`.
   - *Expected Result*: `PERMISSION_DENIED`.

2. **Payload 2: Fake Admin Email Without Verification**
   - *Attempt*: An attacker creates a Firebase user with email `asepakon74@gmail.com` with `email_verified: false` and attempts to delete `/pengurus/peng-1`.
   - *Expected Result*: `PERMISSION_DENIED` (requires `email_verified == true`).

3. **Payload 3: Non-Admin Authenticated User Modifying News**
   - *Attempt*: A standard authenticated user (`user@example.com`) attempts to create or update `/berita/ber-1`.
   - *Expected Result*: `PERMISSION_DENIED`.

4. **Payload 4: Public Snooping on PII (Pendaftaran List Query)**
   - *Attempt*: An anonymous user attempts to list or read documents from `/pendaftaran`.
   - *Expected Result*: `PERMISSION_DENIED`.

5. **Payload 5: Public Snooping on Aspirasi Records**
   - *Attempt*: An unauthenticated attacker attempts to read `/aspirasi/asp-123`.
   - *Expected Result*: `PERMISSION_DENIED`.

6. **Payload 6: Huge Injection / Denial of Wallet Attack**
   - *Attempt*: An attacker submits an aspirasi with an `isi` exceeding 50,000 characters or junk doc ID.
   - *Expected Result*: `PERMISSION_DENIED` (exceeds max length limit).

7. **Payload 7: Shadow Field Injection in Pendaftaran**
   - *Attempt*: Submitting a registration payload containing unauthorized shadow fields like `{ role: 'admin', isApproved: true }`.
   - *Expected Result*: `PERMISSION_DENIED` (strict schema validation).

8. **Payload 8: Self-Promoting Admin Document Creation**
   - *Attempt*: An unauthenticated or non-admin user attempts to create a document in `/admins/{uid}` claiming role `admin`.
   - *Expected Result*: `PERMISSION_DENIED`.

9. **Payload 9: Deleting Public Historical Records as Guest**
   - *Attempt*: Guest attempts `delete` on `/sejarah/sej-1`.
   - *Expected Result*: `PERMISSION_DENIED`.

10. **Payload 10: Invalid ID Injection Attack**
    - *Attempt*: An attacker attempts to write to `/pengurus/../../root` or a 1KB junk-character string ID.
    - *Expected Result*: `PERMISSION_DENIED` (`isValidId` rejects malformed path variables).

11. **Payload 11: Modifying Member Registration Status as Guest**
    - *Attempt*: An applicant tries to update their own `pendaftaran` status from `Baru` to `Diterima`.
    - *Expected Result*: `PERMISSION_DENIED` (update only permitted for Admin).

12. **Payload 12: Blank Catch-All Root Path Write**
    - *Attempt*: An attacker tries to write to arbitrary unspecified collection paths such as `/system_configs/auth`.
    - *Expected Result*: `PERMISSION_DENIED` by default-deny catch-all rule.
