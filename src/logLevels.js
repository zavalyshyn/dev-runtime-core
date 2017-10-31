import log from 'loglevel';

const a = log.getLogger('address-allocation');
const b = log.getLogger('Bus');
const c = log.getLogger('MessageBus');
const d = log.getLogger('CoreDiscovery');
const e = log.getLogger('GraphConnector');
const f = log.getLogger('HypertyResourcesStorage');
const g = log.getLogger('IdentityModule');
const h = log.getLogger('PEP');
const i = log.getLogger('P2PConnectionResolve');
const j = log.getLogger('Registry');
const k = log.getLogger('RuntimeUA');
const l = log.getLogger('Loader');
const m = log.getLogger('Descriptors');
const n = log.getLogger('DataObjectsStorage');
const o = log.getLogger('Subscription');
const p = log.getLogger('SubscriptionManager');
const q = log.getLogger('ObserverObject');
const r = log.getLogger('ReporterObject');
const s = log.getLogger('SynSubscription');
const t = log.getLogger('SyncherManager');

/**
  5 actual logging methods, ordered and available as:

      0 - log.trace(msg)
      1 - log.debug(msg)
      2 - log.info(msg)
      3 - log.warn(msg)
      4 - log.error(msg)

  log.log(msg) is also available, as an alias for log.debug(msg), to improve compatibility with console, and make migration easier.

  Exact output formatting of these will depend on the console available in the current context of your application. For example, many environments will include a full stack trace with all trace() calls, and icons or similar to highlight other calls.

  These methods should never fail in any environment, even if no console object is currently available, and should always fall back to an available log method even if the specific method called (e.g. warn) isn't available.

  Be aware that all this means that these method won't necessarily always produce exactly the output you expect in every environment; loglevel only guarantees that these methods will never explode on you, and that it will call the most relevant method it can find, with your argument. Firefox is a notable example here: due to a current Firefox bug log.trace(msg) calls in Firefox will print only the stacktrace, and won't include any passed message arguments.

*/


// address-allocation
a.setLevel(5);

// Bus
b.setLevel(5);

// MessageBus
c.setLevel(0);

// CoreDiscovery
d.setLevel(5);

// GraphConnector
e.setLevel(5);

// HypertyResourcesStorage
f.setLevel(0);

// IdentityModule
g.setLevel(5);

// PEP
h.setLevel(5);

// P2PConnectionResolve
i.setLevel(5);

// Registry
j.setLevel(5);

// RuntimeUA
k.setLevel(5);

// Loader
l.setLevel(5);

// Descriptors
m.setLevel(5);

// DataObjectsStorage
n.setLevel(5);

// Subscription
o.setLevel(5);

// SubscriptionManager
p.setLevel(5);

// ObserverObject
q.setLevel(3);

// ReporterObject
r.setLevel(3);

// SynSubscription
s.setLevel(3);

// SyncherManager
t.setLevel(3);