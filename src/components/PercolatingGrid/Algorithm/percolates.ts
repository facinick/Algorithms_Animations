// p - probability a site in the structure will be open
// 1-p - probability a site in the structure will be closed
// p* the probability value, wbove which if p lies then the structure will percolate
// what is this p*? 
// way to find is, run a simulation and calulate p, over time average it.

// Monte Carlo Simulation

// initialise whole grid black
// randomly open sites
// every time a site opens, check if system percolates
// if it does, how long did it take?

class Percolates {

  private id: Array<number>;
  private open: Array<boolean>;
  private nOpenSites: number;
  private nComponents: number;
  private weight: Array<number>;

  private M: number;
  private N: number;
  private LENGTH: number;

  constructor(nRows: number, nColumns: number) {

    this.M = nRows;
    this.N = nColumns;
    this.LENGTH = this.M * this.N + 2; // added two virtual sites;

    this.id = new Array<number>(this.LENGTH).fill(0);
    this.id.forEach((_, index, array) => {
      array[index] = index;
    })
    this.open = new Array<boolean>(this.LENGTH).fill(false);
    // open both virtual sites
    this.open[0] = true;
    this.open[this.M * this.N + 2 - 1] = true;

    this.weight = new Array<number>(this.LENGTH).fill(1);

    this.nOpenSites = 0;
    this.nComponents = this.M * this.N;
  }

  // same as root(p: number): number
  public  find(p: number): number {
      let child = p;
      let parent = this.id[p];
  
      // in case we find root element, it's value will point to it's own id. 
      // child is the element / id / node
      // parent is the value of that id in array, id of another element. sighs
      while(child !== parent) {
        child = parent
        parent = this.id[child]
      }
      return parent;
  }

  public union(p: number, q: number): void {
    const rootP = this.find(p)
    const rootQ = this.find(q)

    if(rootP === rootQ) {
      return;
    }

    // incorrect, also reduces component count when connecting to virtual sites
    this.nComponents -= 1;

        // p is in smaller tree, make p's root's parent q's root
    if(this.weight[rootP] < this.weight[rootQ]) {
      this.id[rootP] = rootQ
      this.weight[rootQ] = this.weight[rootQ] + this.weight[rootP]
    } else {
      this.id[rootQ] = rootP
      this.weight[rootP] = this.weight[rootQ] + this.weight[rootP]
    }
  }

  // p >> [1 to n] in MxN grid
  public openSite(p: number): void {
    if(this.isOpen(p)) {
      return;
    }

    this.open[p] = true;
    this.nOpenSites += 1;

    const VIRTUAL_SITE_FIRST_INDEX = 0
    const VIRTUSL_SITE_LAST_INDEX = this.M * this.N + 2 - 1;

    const FIRST_ROW_INDEX = 0;
    const FIRST_COL_INDEX = 0;
    const LAST_ROW_INDEX = this.M-1;
    const LAST_COL_INDEX = this.N-1;

    // now union with all adjacent OPEN neighbours
    const P_ROW = Math.floor((p-1) / this.N);
    const P_COL = (p-1) % this.N;
    
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
        this.union(p, p-1)
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
        this.union(p, p+1)
      }
    }

    // top ======================================================
    // top most i.e. no top neighbour except virtual cell
    if(P_ROW === FIRST_ROW_INDEX) {
      // if open, union
      if(this.isOpen(VIRTUAL_SITE_FIRST_INDEX)) {
        console.log(`Connecting ${p} & ${VIRTUAL_SITE_FIRST_INDEX}`)
        this.union(p, VIRTUAL_SITE_FIRST_INDEX)
      }
    }
    // there is a top cell
    else {
      // if open, union
      if(this.isOpen(p-this.N)) {
        console.log(`Connecting ${p} & ${p-this.N}`)
        this.union(p, p-this.N)
      }
    }

    // bottom ======================================================
    // bottom most i.e. no bottom neighbour except virtual cell
    if(P_ROW === LAST_ROW_INDEX) {
      // if open, union
      if(this.isOpen(VIRTUSL_SITE_LAST_INDEX)) {
        console.log(`Connecting ${p} & ${VIRTUSL_SITE_LAST_INDEX}`)
        this.union(p, VIRTUSL_SITE_LAST_INDEX)
      }
    }
    // there is a bottom cell
    else {
      // if open, union
      if(this.isOpen(p+this.N)) {
        console.log(`Connecting ${p} & ${p+this.N}`)
        this.union(p, p+this.N)
      }
    }
  }

  public isOpen(p: number): boolean {
    return this.open[p];
  }

  public connected(p: number, q: number): boolean {
    return this.find(p) === this.find(q);
  }

  count(): number {
    return this.nComponents;
  }

  public display(): void {
    const padding = 1; // Adjust based on desired spacing around digits
    const maxDigitWidth = 2;
    for (let row = 0; row < this.M; row++) {
      let result = "";
      for (let col = 0; col < this.N; col++) {
        const index = row * this.N + col + 1;
        const element = this.id[index];
        result += element.toString().padStart(maxDigitWidth + padding * 2, " ");
      }
      console.log(result);
    }
  }

  public percolating(): boolean {
    const VIRTUAL_SITE_FIRST_INDEX = 0
    const VIRTUSL_SITE_LAST_INDEX = this.M * this.N + 2 - 1;

    return this.connected(VIRTUAL_SITE_FIRST_INDEX, VIRTUSL_SITE_LAST_INDEX)
  }

}

export { Percolates };
