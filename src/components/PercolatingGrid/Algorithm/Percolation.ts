import { WeightedQuickUnion } from "./WeightedQuickUnion";

class Percolation {

  private sites: WeightedQuickUnion
  private open: Array<boolean>;
  private nSitesOpen: number = 0;

  private ROWS: number;
  private COLS: number;
  private TOP_VIRTUAL_SITE_INDEX: number;
  private BOTTOM_VIRTUAL_SITE_INDEX: number;

  constructor(p: number, q: number) {
    this.ROWS = p;
    this.COLS = q;
    this.TOP_VIRTUAL_SITE_INDEX = 0;
    this.BOTTOM_VIRTUAL_SITE_INDEX = this.ROWS * this.COLS + 2 - 1;
    this.sites = new WeightedQuickUnion(this.ROWS * this.COLS + 2);
    this.open = new Array<boolean>().fill(false)
    this.open[this.TOP_VIRTUAL_SITE_INDEX] = true;
    this.open[this.BOTTOM_VIRTUAL_SITE_INDEX] = true;
  }

  public openSite(p: number): void {
    if(this.isOpen(p)) {
      return;
    }

    this.open[p] = true;
    this.nSitesOpen += 1;
    this.unionWithOpenNeighbours(p)
  }

  public getNSitesOpen(): number {
    return this.nSitesOpen;
  }

  public unionWithOpenNeighbours(p: number): void {

    const FIRST_ROW_INDEX = 0;
    const FIRST_COL_INDEX = 0;
    const LAST_ROW_INDEX = this.ROWS-1;
    const LAST_COL_INDEX = this.COLS-1;
    const P_ROW = Math.floor((p-1) / this.COLS);
    const P_COL = (p-1) % this.COLS;

    // left ======================================================
    // left most i.e. no left neighbour
    if(P_COL === FIRST_COL_INDEX) {
      // continue
    }
    // there is a left cell
    else {
      // if open, union
      if(this.isOpen(p-1)) {
        console.log(`Connecting ${p} & ${p-1}`)
        this.sites.union(p, p-1)
      }
    }
    // right ======================================================
    // right most i.e. no right neighbour
    if(P_COL === LAST_COL_INDEX) {
      // continue
    }
    // there is a right cell
    else {
      // if open, union
      if(this.isOpen(p+1)) {
        console.log(`Connecting ${p} & ${p+1}`)
        this.sites.union(p, p+1)
      }
    }

    // top ======================================================
    // top most i.e. no top neighbour except virtual cell
    if(P_ROW === FIRST_ROW_INDEX) {
      // if open, union
      if(this.isOpen(this.TOP_VIRTUAL_SITE_INDEX)) {
        console.log(`Connecting ${p} & ${this.TOP_VIRTUAL_SITE_INDEX}`)
        this.sites.union(p, this.TOP_VIRTUAL_SITE_INDEX)
      }
    }
    // there is a top cell
    else {
      // if open, union
      if(this.isOpen(p-this.COLS)) {
        console.log(`Connecting ${p} & ${p-this.COLS}`)
        this.sites.union(p, p-this.COLS)
      }
    }

    // bottom ======================================================
    // bottom most i.e. no bottom neighbour except virtual cell
    if(P_ROW === LAST_ROW_INDEX) {
      // if open, union
      if(this.isOpen(this.BOTTOM_VIRTUAL_SITE_INDEX)) {
        console.log(`Connecting ${p} & ${this.BOTTOM_VIRTUAL_SITE_INDEX}`)
        this.sites.union(p, this.BOTTOM_VIRTUAL_SITE_INDEX)
      }
    }
    // there is a bottom cell
    else {
      // if open, union
      if(this.isOpen(p+this.COLS)) {
        console.log(`Connecting ${p} & ${p+this.COLS}`)
        this.sites.union(p, p+this.COLS)
      }
    }
  }

  public isOpen(p: number): boolean  {
    return this.open[p];
  }

  public isPercolating(): boolean {
    return this.sites.connected(this.TOP_VIRTUAL_SITE_INDEX, this.BOTTOM_VIRTUAL_SITE_INDEX)
  }

  public getData(): WeightedQuickUnion['id'] {
    return this.sites.getData()
  }

  public getOpenData(): Array<boolean> {
    return this.open;
  }
}

export { Percolation };
