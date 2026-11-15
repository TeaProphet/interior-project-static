import contacts from '../../content/contacts.json';
export type Contacts = typeof contacts;
export const contactsService = { async getContacts(): Promise<Contacts> { return contacts; } };
