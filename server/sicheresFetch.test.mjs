import { describe, expect, it } from 'vitest';
import { istPrivateIp } from './sicheresFetch.mjs';

describe('Private/interne IP-Adressen erkennen (SSRF-Schutz)', () => {
  it('erkennt Loopback-Adressen', () => {
    expect(istPrivateIp('127.0.0.1')).toBe(true);
    expect(istPrivateIp('127.5.5.5')).toBe(true);
    expect(istPrivateIp('::1')).toBe(true);
  });

  it('erkennt private Netzbereiche (Heimnetz, Firmennetz)', () => {
    expect(istPrivateIp('10.0.0.1')).toBe(true);
    expect(istPrivateIp('192.168.1.1')).toBe(true);
    expect(istPrivateIp('192.168.178.1')).toBe(true);
    expect(istPrivateIp('172.16.0.1')).toBe(true);
    expect(istPrivateIp('172.31.255.255')).toBe(true);
    // Direkt außerhalb von 172.16.0.0/12 – darf NICHT blockiert werden.
    expect(istPrivateIp('172.32.0.1')).toBe(false);
    expect(istPrivateIp('172.15.255.255')).toBe(false);
  });

  it('erkennt Link-lokale Adressen (u. a. Cloud-Metadaten-Server wie 169.254.169.254)', () => {
    expect(istPrivateIp('169.254.169.254')).toBe(true);
    expect(istPrivateIp('169.254.0.1')).toBe(true);
  });

  it('erkennt IPv4-in-IPv6 eingebettete private Adressen', () => {
    expect(istPrivateIp('::ffff:127.0.0.1')).toBe(true);
    expect(istPrivateIp('::ffff:192.168.1.1')).toBe(true);
  });

  it('erkennt private IPv6-Bereiche', () => {
    expect(istPrivateIp('fe80::1')).toBe(true); // Link-lokal
    expect(istPrivateIp('fd12:3456:789a::1')).toBe(true); // Unique Local
  });

  it('lässt echte, öffentliche Adressen durch', () => {
    expect(istPrivateIp('8.8.8.8')).toBe(false); // Google DNS
    expect(istPrivateIp('93.184.216.34')).toBe(false); // öffentliche Beispiel-IP
    expect(istPrivateIp('2001:4860:4860::8888')).toBe(false); // Google DNS v6
  });
});
