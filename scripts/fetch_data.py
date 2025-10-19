#!/usr/bin/env python3
"""
Google Drive dataset fetcher for AI Furniture Recommendations.
Downloads datasets from Google Drive and normalizes them to the expected format.
"""
import os
import sys
import zipfile
import argparse
import pandas as pd
from pathlib import Path
from typing import List, Optional, Dict, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def check_gdown_available() -> bool:
    """Check if gdown is available."""
    try:
        import gdown
        return True
    except ImportError:
        return False


def install_gdown_hint():
    """Print clear installation hint for gdown."""
    print("❌ gdown is not installed.")
    print("📦 Install it with:")
    print("   pip install gdown")
    print("   # or")
    print("   conda install -c conda-forge gdown")
    print("\n💡 gdown is required for downloading from Google Drive.")
    sys.exit(1)


def extract_file_id_from_url(url: str) -> str:
    """Extract file ID from Google Drive URL."""
    # Handle different Google Drive URL formats
    if '/file/d/' in url:
        # Format: https://drive.google.com/file/d/FILE_ID/view
        start = url.find('/file/d/') + 8
        end = url.find('/', start)
        if end == -1:
            end = url.find('?', start)
        if end == -1:
            end = len(url)
        return url[start:end]
    elif 'id=' in url:
        # Format: https://drive.google.com/open?id=FILE_ID
        start = url.find('id=') + 3
        end = url.find('&', start)
        if end == -1:
            end = len(url)
        return url[start:end]
    else:
        raise ValueError(f"Could not extract file ID from URL: {url}")


def download_from_google_drive(url: str, output_path: str) -> str:
    """Download file or folder from Google Drive using gdown."""
    if not check_gdown_available():
        install_gdown_hint()
    
    import gdown
    
    logger.info(f"Downloading from Google Drive: {url}")
    
    try:
        # Try to download as folder first
        if '/folders/' in url or 'folder' in url.lower():
            logger.info("Detected folder URL, downloading as folder...")
            gdown.download_folder(url, output=output_path, quiet=False)
            return output_path
        else:
            # Download as file
            file_id = extract_file_id_from_url(url)
            file_url = f"https://drive.google.com/uc?id={file_id}"
            
            logger.info(f"Downloading file with ID: {file_id}")
            gdown.download(file_url, output_path, quiet=False)
            return output_path
            
    except Exception as e:
        logger.error(f"Failed to download from Google Drive: {e}")
        raise


def extract_zip_if_needed(file_path: str, extract_to: str) -> str:
    """Extract zip file if needed and return the extracted directory."""
    if file_path.endswith('.zip'):
        logger.info(f"Extracting {file_path} to {extract_to}")
        
        with zipfile.ZipFile(file_path, 'r') as zip_ref:
            zip_ref.extractall(extract_to)
        
        # Delete the zip file
        os.remove(file_path)
        logger.info(f"Deleted zip file: {file_path}")
        
        return extract_to
    else:
        return file_path


def find_csv_files(directory: str) -> List[str]:
    """Find all CSV files in directory and subdirectories."""
    csv_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.csv'):
                csv_files.append(os.path.join(root, file))
    return csv_files


def score_csv_for_furniture(csv_path: str) -> int:
    """Score CSV file based on furniture-related columns."""
    try:
        df = pd.read_csv(csv_path, nrows=5)  # Read first 5 rows to check columns
        columns = [col.lower() for col in df.columns]
        
        furniture_keywords = ['title', 'description', 'categories', 'brand', 'name', 'product']
        score = sum(1 for keyword in furniture_keywords if any(keyword in col for col in columns))
        
        logger.debug(f"CSV {csv_path}: score={score}, columns={df.columns.tolist()}")
        return score
        
    except Exception as e:
        logger.warning(f"Could not read CSV {csv_path}: {e}")
        return 0


def choose_best_csv(csv_files: List[str]) -> str:
    """Choose the best CSV file for furniture data."""
    if not csv_files:
        raise ValueError("No CSV files found")
    
    if len(csv_files) == 1:
        logger.info(f"Only one CSV found: {csv_files[0]}")
        return csv_files[0]
    
    # Score each CSV
    scored_csvs = [(csv, score_csv_for_furniture(csv)) for csv in csv_files]
    scored_csvs.sort(key=lambda x: x[1], reverse=True)
    
    best_csv, best_score = scored_csvs[0]
    
    logger.info(f"Found {len(csv_files)} CSV files:")
    for csv, score in scored_csvs:
        logger.info(f"  {os.path.basename(csv)}: score={score}")
    
    logger.info(f"Chosen: {os.path.basename(best_csv)} (score={best_score})")
    return best_csv


def normalize_csv(input_csv: str, output_csv: str) -> Dict[str, Any]:
    """Normalize CSV to the expected format."""
    logger.info(f"Normalizing {input_csv} to {output_csv}")
    
    # Read the CSV
    df = pd.read_csv(input_csv)
    
    # Create normalized dataframe
    normalized_df = pd.DataFrame()
    
    # Map columns (case-insensitive)
    column_mapping = {}
    for col in df.columns:
        col_lower = col.lower()
        if 'title' in col_lower or 'name' in col_lower:
            column_mapping[col] = 'title'
        elif 'brand' in col_lower:
            column_mapping[col] = 'brand'
        elif 'description' in col_lower or 'desc' in col_lower:
            column_mapping[col] = 'description'
        elif 'price' in col_lower or 'cost' in col_lower:
            column_mapping[col] = 'price'
        elif 'categor' in col_lower or 'type' in col_lower:
            column_mapping[col] = 'categories'
        elif 'image' in col_lower or 'photo' in col_lower or 'url' in col_lower:
            column_mapping[col] = 'image_url'
        elif 'material' in col_lower:
            column_mapping[col] = 'material'
        elif 'color' in col_lower or 'colour' in col_lower:
            column_mapping[col] = 'color'
    
    logger.info(f"Column mapping: {column_mapping}")
    
    # Apply mapping
    for original_col, target_col in column_mapping.items():
        normalized_df[target_col] = df[original_col]
    
    # Generate uniq_id if not present
    if 'uniq_id' not in normalized_df.columns:
        normalized_df['uniq_id'] = [f"prod_{i+1:06d}" for i in range(len(normalized_df))]
        logger.info("Generated uniq_id column")
    
    # Ensure all required columns exist
    required_columns = ['uniq_id', 'title', 'brand', 'description', 'price', 'categories', 'image_url', 'material', 'color']
    for col in required_columns:
        if col not in normalized_df.columns:
            normalized_df[col] = ''
    
    # Reorder columns
    normalized_df = normalized_df[required_columns]
    
    # Clean and convert data
    normalized_df = normalized_df.fillna('')
    
    # Convert price to float where possible
    price_converted = 0
    for i, price in enumerate(normalized_df['price']):
        if pd.notna(price) and price != '':
            try:
                # Remove currency symbols and convert
                price_str = str(price).replace('$', '').replace(',', '').strip()
                if price_str:
                    normalized_df.iloc[i, normalized_df.columns.get_loc('price')] = float(price_str)
                    price_converted += 1
            except (ValueError, TypeError):
                pass
    
    logger.info(f"Converted {price_converted} prices to float")
    
    # Save normalized CSV
    normalized_df.to_csv(output_csv, index=False)
    
    return {
        'rows': len(normalized_df),
        'columns': len(normalized_df.columns),
        'sample_titles': normalized_df['title'].head(3).tolist(),
        'price_converted': price_converted
    }


def print_summary(summary: Dict[str, Any], csv_path: str):
    """Print summary of the processed data."""
    print(f"\n📊 Dataset Summary")
    print(f"=" * 30)
    print(f"Source: {os.path.basename(csv_path)}")
    print(f"Rows: {summary['rows']:,}")
    print(f"Columns: {summary['columns']}")
    print(f"Prices converted: {summary['price_converted']}")
    print(f"\n📝 Sample Titles:")
    for i, title in enumerate(summary['sample_titles'], 1):
        print(f"  {i}. {title}")
    print(f"\n✅ Normalized data saved to: data/products.csv")


def main():
    """Main function."""
    parser = argparse.ArgumentParser(description='Download and normalize datasets from Google Drive')
    parser.add_argument('--url', type=str, help='Google Drive URL (file or folder)')
    parser.add_argument('--output', type=str, default='data/', help='Output directory (default: data/)')
    parser.add_argument('--force', action='store_true', help='Force download even if data/products.csv exists')
    
    args = parser.parse_args()
    
    # Check if gdown is available
    if not check_gdown_available():
        install_gdown_hint()
    
    # Get URL from args or environment
    url = args.url
    if not url:
        url = os.getenv('DATA_DRIVE_URL')
        if not url:
            print("❌ No URL provided. Use --url or set DATA_DRIVE_URL environment variable.")
            print("💡 Example: python -m scripts.fetch_data --url 'https://drive.google.com/file/d/...'")
            sys.exit(1)
    
    # Create output directory
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Check if products.csv already exists
    products_csv = output_dir / 'products.csv'
    if products_csv.exists() and not args.force:
        print(f"✅ {products_csv} already exists. Use --force to overwrite.")
        return
    
    try:
        # Download from Google Drive
        download_path = output_dir / 'downloaded_data'
        downloaded_path = download_from_google_drive(url, str(download_path))
        
        # Extract if it's a zip file
        extracted_path = extract_zip_if_needed(downloaded_path, str(output_dir / 'extracted'))
        
        # Find CSV files
        csv_files = find_csv_files(extracted_path)
        if not csv_files:
            raise ValueError("No CSV files found in downloaded data")
        
        # Choose best CSV
        best_csv = choose_best_csv(csv_files)
        
        # Normalize CSV
        summary = normalize_csv(best_csv, str(products_csv))
        
        # Print summary
        print_summary(summary, best_csv)
        
        # Cleanup
        if os.path.exists(downloaded_path):
            import shutil
            shutil.rmtree(downloaded_path)
            logger.info(f"Cleaned up temporary directory: {downloaded_path}")
        
        print(f"\n🎉 Dataset processing complete!")
        
    except Exception as e:
        logger.error(f"Error processing dataset: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
