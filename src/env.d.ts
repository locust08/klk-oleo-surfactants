declare namespace App {
  interface Locals {
    emdash?: import('emdash/astro').EmDashHandlers;
    user?: import('@emdash-cms/auth').User;
  }
}
